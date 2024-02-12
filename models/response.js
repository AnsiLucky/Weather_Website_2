const mongoose = require('mongoose');
const weatherSchema = require('./weather');
const cityInfoSchema = require('./cityInfo');

const responseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // current: { type: Schema.Types.ObjectId, ref: 'Weather' },
  // forecast14Days: [{ type: Schema.Types.ObjectId, ref: 'Weather' }],
  // forecast3Hours: [{ type: Schema.Types.ObjectId, ref: 'Weather' }],
  // cityInfo: { type: Schema.Types.ObjectId, ref: 'City' },
  info: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now() },
});

module.exports= mongoose.model("Response", responseSchema);
