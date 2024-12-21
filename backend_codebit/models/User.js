
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
   userId:{
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
      enum: ["student", "admin" , "interviewer"],
      required: true,
    },
    bio:{
      type: String

    }
   ,
   
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
    // progress: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "courseProgress",
    //   },
    // ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }

    

 
)

module.exports = mongoose.model("user", userSchema)
