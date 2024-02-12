const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: {type: String},
  latitude: {type: String},
  longitude: {type: String},
  country: {type: String},
  population: {type: String},
  is_capital: {type: Boolean},
});
