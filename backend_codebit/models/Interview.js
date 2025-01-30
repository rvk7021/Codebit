// const mongoose = require('mongoose');

// const InterviewSchema = new mongoose.Schema({
//   interviewId: { type: String, required: true, unique: true },
//   userId: { type: String, required: true, ref: 'User' }, 
//   interviewerId: { type: String, required: true, ref: 'Interviewer' }, 
//   scheduledTime: { type: Date, required: true }, 
//   duration: { type: Number, required: true },
//   topics: { type: [String], required: true }, 
//   questions: { type: [String], required: true }, 
//   status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }, 
//   feedback: { type: Object, required: false }, 
//   score: { type: Number, required: false }, 
//   transcript: { type: String, required: false },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now } 
// });

// module.exports = mongoose.model('Interview', InterviewSchema);
