const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
  contestId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, 
  description: { type: String, required: true }, 
  startTime: { type: Date, required: true }, 
  endTime: { type: Date, required: true }, 
  link: { type: String, required: true }, 
  platform: { type: String, required: true },
  notifiedUsers: { type: [String], default: [] } 
});

module.exports = mongoose.model('Contest', ContestSchema);
