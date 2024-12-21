const mongoose = require('mongoose');

const CompilerSchema = new mongoose.Schema({
  runId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, ref: 'User' }, 
  code: { type: String, required: true },
  language: { type: String, required: true }, 
  input: { type: String, default: "" }, 
  output: { type: String, default: "" }, 
  status: { type: String, required: true, enum: ["Success", "Error"] }, 
  runtime: { type: Number, default: 0 }, 
  memory: { type: Number, default: 0 }, 
  executedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Compiler', CompilerSchema);
