const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  leaderboardId: { type: String, required: true, unique: true }, 
  contestId: { type: String, required: false }, 
  userId: { type: String, required: true, ref: 'User' },
  score: { type: Number, required: true }, 
  rank: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
