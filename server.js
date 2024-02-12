const express = require('express');
const flash = require('express-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pageRoutes = require('./routes/pageRoutes')
const { SESSION_SECRET, PORT } = require('./config/general');
const { MONGODB_URL } = require('./config/db');

// Initialize Express app
const app = express();

// Set cors
app.use(cors());

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB database
mongoose.connect(MONGODB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Set up static files directory
app.use("/public", express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('', pageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // res.status(500).send('Something broke!'); 
  res.render('index', {error: "Something broke!"})
});

// Start the server
const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

