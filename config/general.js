require('dotenv').config();

module.exports = { PORT: process.env.PORT, 
                  SESSION_SECRET: process.env.SESSION_SECRET }