const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  submissionId: { type: String, required: true, unique: true }, 
  userId: { type: String, required: true, ref: 'User' }, 
  problemId: { type: String, required: true, ref: 'Problem' }, 
  code: { type: String, required: true }, 
  language: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error', 'Time Limit Exceeded'], 
    required: true 
  },
  runtime: { type: Number, required: true }, 
  memory: { type: Number, required: true }, 
  submittedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Submission', SubmissionSchema);
