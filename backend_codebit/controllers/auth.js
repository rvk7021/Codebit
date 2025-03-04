const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary'); 
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password, college } = req.body;

    console.log(userName, firstName, lastName, email, password, college);

    if (!userName || !firstName || !lastName || !email || !password || !college) {
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
      role: "student",
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
    console.log(email, password);


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
        { email: user.email, id: user._id, userName: user.userName, role: user.role },
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
        secure: false,
        sameSite: "lax"

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


exports.getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
 const user= await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "lax" });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.updateProfile = async (req, res) => {
  try {
    // Hardcoded user ID for now
    
    const userId = req.user.id; 
    const { bio, country, firstName, lastName } = req.body;
    const file = req.files?.file;

    // Check if at least one field is provided
    if (!file && !bio && !country && !firstName && !lastName) {
      return res.status(400).json({ success: false, message: "Fill Some Details" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User  not found" });
    }

    // Handle file upload if provided
    if (file) {
      const uploadedMedia = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "profile" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.data);
      });

      const url = uploadedMedia.secure_url;

      // Delete the old profile picture if it exists
      if (user.profilePic) {
        const publicId = user.profilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      user.profilePic = url;
    }

    // Update user fields if provided
    if (bio) {
      user.bio = bio;
    }

    if (country) {
      user.country = country; // Ensure consistent casing
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error for debugging
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addSocialMediaAccount = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { platform, username } = req.body;

    // Validate platform
    const validPlatforms = ["linkedin", "twitter", "instagram"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ success: false, message: "Invalid platform" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove empty or null values before adding
    if (!username || username.trim() === "") {
      delete user.SocialMedia[platform]; // Remove platform if username is empty
    } else {
      user.SocialMedia[platform] = username.trim(); // Add new username
    }

    await user.save();
    return res.status(200).json({ success: true, message: `${platform} updated successfully!` });

  } catch (error) {
    console.error("Error adding social media account:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




// Get & Add Coding Profile
exports.getCodingProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { LeetCode, Codeforces, CodeChef } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!(LeetCode || Codeforces || CodeChef)) {
      return res.status(400).json({ success: false, message: "Please provide a platform name" });
    }
    if (LeetCode) user.codingProfile.LeetCode = LeetCode;
    if (Codeforces) user.codingProfile.Codeforces = Codeforces;
    if (CodeChef) user.codingProfile.CodeChef = CodeChef;

    await user.save();

    return res.status(200).json({ success: true, message: "Coding profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove Coding Profile
exports.removeCodingProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { platform } = req.body;

    // Validate platform name
    const validPlatforms = ["LeetCode", "Codeforces", "CodeChef"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ success: false, message: "Invalid platform name" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the platform is already empty
    if (!user.codingProfile[platform]) {
      return res.status(400).json({ success: false, message: `${platform} first add a profile` });
    }

    // Remove profile by setting it to null
    user.codingProfile[platform] = null;
    await user.save();

    return res.status(200).json({ success: true, message: `${platform} profile removed successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// add the githubprofile section

exports.addGithubProfile = async (req, res) => {
  const userId = req.user.id; 
  try {
    const { githubProfile } = req.body;
    if (!githubProfile) {
      return res.status(400).json({ success: false, message: "Please provide a github profile" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.githubProfile = githubProfile;
    await user.save();
    return res.status(200).json({ success: true, message: "Github profile added successfull" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to add github" });
  }
}