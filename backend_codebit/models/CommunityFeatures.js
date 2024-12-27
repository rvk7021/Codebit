const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  content: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } 
});

const PostSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true }, 
  userId: { type: String, required: true, ref: 'User' },
  content: { type: String, required: true }, 
  tags: { type: [String], required: false }, 
  likes: { type: Number, default: 0 }, 
  comments: { type: [CommentSchema], default: [] },
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
