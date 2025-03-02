const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const {userName, firstName, lastName, email, password, college } = req.body;
  
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
 console.log("API CALLED");
 console.log(email,password);
 
  
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
        { email: user.email, id: user._id,userName:user.userName, role: user.role },
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
        secure:false,
        sameSite:"lax"
       
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
   const userId=req.user.id;
   
   const {bio,country}=req.body;
   const file = req.files?.file;
   if(!file&&!bio&&!country){
     return res.status(400).json({ success: false, message: "Fill Some Details" });
   } 
   const user=await User.findById(userId);
   if(file){
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
  const url=uploadedMedia.secure_url;
 if(user.profilePic){

  await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0]);
  user.profilePic=url;

 }
}
if(bio){
  user.bio=bio;
}
if(country){
  user.Country=country;
}
await user.save();
 
return res.status(200).json({ success: true, message: "Profile updated successfully" ,user});
}
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
 }
};
exports.addSocialMediaAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { platform, username } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

   
    const existingAccount = user.SocialMedia.find(acc => acc.platform === platform);

    if (existingAccount) {
    
      existingAccount.username = username;
    } else {
      
      user.SocialMedia.push({ platform, username });
    }

    await user.save();
    return res.status(200).json({ success: true, message: "Social media account updated successfully" });

  } catch (error) {
    console.error("Error adding social media account:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
