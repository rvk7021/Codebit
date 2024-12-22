const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const userId = Date.now();

    if (!firstName || !lastName || !email || !password || !role) {
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
      userId: userId,
      firstName,
      lastName,
      password: hashPassword,
      email,
      role,
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

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token, user,
        message: "login successful",
      });

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
