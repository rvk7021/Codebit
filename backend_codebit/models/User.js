
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "interviewer"],
      required: true
    },
    bio: {
      type: String
    },
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    profilePic: {
      type: String,
    },
    topics: { type: [String], required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    problemsSolved: {
      type: Number,
      default: 0
    },
    solvedProblems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    profilePic: {
      type: String,
      require: false
    },
    codingProfile: [{
      profileName: {
        type: String,
        require: false
      },
      platform: {
        type: String,
        require: function() {
          return this.profileName != null;
        }
      }
    }],
  }
);

module.exports = mongoose.model("user", userSchema)
