const mongoose = require('mongoose');

const SheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
//   description: {
//     type: String,
//     default: ''
//   },
//   isPublic: {
//     type: Boolean,
//     default: false
//   },
  groups: [{
    groupName: {
      type: String,
      required: true
    },
    problems: [{
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
      },
      notes: {
        type: String,
        default: ''
      }
    }]
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sheet', SheetSchema);
