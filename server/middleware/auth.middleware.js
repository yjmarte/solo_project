const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(400).json({ message: "Invalid authentication." });
    }
    
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid authentication." });
    }
        
    const user = await User.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
};

module.exports = auth;
