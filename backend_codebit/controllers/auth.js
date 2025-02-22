const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const {userName, firstName, lastName, email, password, college } = req.body;
    // const userId = Date.now();
    console.log(userName, firstName, lastName, email, password,college);
    
    if (!userName||!firstName || !lastName || !email || !password ||!college) {
      return res.status(400).json({
        success: false,
        message: "All fields required",

      });
    }

    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      firstName,
      lastName,
      password: hashPassword,
      email,
      role:"student",
      college
    });

  
  return res.status(200).json({
      success: true,
      message: 'User signup successful',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in user signup',
      err: error.message,
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are mandatory",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        } 
      )

      // Save token to user document in database
      user.token = token
      user.password = undefined
      // Set cookie for token and return success response
      // httpOnly: This ensures that the cookie cannot be accessed via JavaScript (helps prevent cross-site scripting attacks).
      
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      })

    } else {
      return res.status(400).json({
        success: false,
        message: 'Password does not match',
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'User Login Failed',
      error: err.message,
    });
  }
}

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
   
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}