const express = require('express');
const flash = require('express-flash');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
require('./pageRoutes');

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (user === null) {
      req.flash('error', 'User Not Exist');
      return res.redirect('/login');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      req.flash('error', 'The Password is Incorrect');
      return res.redirect('/login');
    }
    req.session.isAuthenticated = true;
    req.session.isAdmin = user.isAdmin;
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.language = req.session.language || 'en';
    if (req.session.isAdmin == true) {
      return res.redirect('/admin');
    }
    return res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    req.flash('error', 'The Error Occur on Server');
    return res.redirect('/login');
    // res.render('login', {message : { success : null, error : 'The Error Occur on Server'}})
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        console.log(err);
    }
  });
  res.redirect('/');
});

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email,  password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User Already Exist");
      return res.redirect('/login');
    }
    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    req.flash("success", "The User Successefully Created");
    return res.redirect('/login');
  } catch (err) {
    req.flash("error", "Something Went Wrong");
    return res.redirect('/login');
  }
});

router.get('/setLanguage/:lang', (req, res) => {
  const { lang } = req.params;
  console.log(req.headers.referer);
  if (lang === "ru" || lang === "en") {
    req.session.language = lang;
  }
  res.redirect('/');
});

module.exports = router;
