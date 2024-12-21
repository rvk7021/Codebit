const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true }, 
  userId: { type: String, required: true, ref: 'User' }, 
  message: { type: String, required: true }, 
  isRead: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Notification', NotificationSchema);
