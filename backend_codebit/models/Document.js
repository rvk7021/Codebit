const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true }, 
  userId: { type: String, required: true, ref: 'User' }, 
  title: { type: String, required: true }, 
  content: { type: String, required: true }, 
  tags: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Document', DocumentSchema);
