const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, unique: true },
    ru: { type: String, required: true, unique: true },
  },
  description: { 
    en: { type: String, required: true },
    ru: { type: String, required: true },
   },
  photos: { 
    one: { type: String, required: true, unique: true },
    two: { type: String, required: true, unique: true },
    three: { type: String, required: true, unique: true },
   }
}, { timestamps: true });

module.exports = mongoose.model('CityCard', citySchema);
