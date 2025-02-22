
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();
exports.auth = async (req, res, next) => {
	try {
	  console.log("auth middleware triggered");
  
	  // ✅ Retrieve token only from headers or cookies (GET request has no body)
	  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  
	  console.log("Extracted Token:", token);
  
	  if (!token) {
		return res.status(401).json({ success: false, message: "Token Missing" });
	  }
  
	  try {
		// ✅ Verify token
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decode; // Attach user data to request
		next();
	  } catch (error) {
		return res.status(401).json({ success: false, message: "Invalid Token" });
	  }
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: "Something Went Wrong While Validating the Token",
	  });
	}
  };
  