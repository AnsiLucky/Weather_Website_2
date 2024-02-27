const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  options: {
    en: [String],
    ru: [String]
  },
  correctAnswer: { type: Number, required: true },
  category: String,
  difficultyLevel: String,
});

module.exports = mongoose.model('Quiz', quizSchema);
