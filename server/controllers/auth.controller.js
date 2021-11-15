const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthController = {
  register: async (req, res) => {
    try {
      const { name, username, password, confirmPassword } = req.body;
      let newUsername = username.toLowerCase().replace(/ /g, "");

      // Check name for errors.
      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      } else if (name.length < 2) {
        return res
          .status(400)
          .json({ message: "Name must be at least 2 characters in length." });
      } else if (name.length > 30) {
        return res
          .status(400)
          .json({ message: "Name must not exceed 30 characters in length." });
      }

      const user_name = await User.findOne({ username: newUsername });

      // Check username for errors.
      if (user_name)
        return res.status(400).json({ message: "Username taken." });

      if (!newUsername) {
        return res.status(400).json({ message: "Username is required." });
      } else if (newUsername.length < 3) {
        return res.status(400).json({
          message: "Username must be at least 3 characters in length.",
        });
      } else if (newUsername.length > 15) {
        return res.status(400).json({
          message: "Username must not exceed 15 characters in length.",
        });
      }

      // Check password for errors.
      if (!password) {
        return res.status(400).json({ message: "Password is required." });
      } else if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long." });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new User({
        name: name,
        username: newUsername,
        password: passwordHash,
      });

      const access_token = createAccessToken({ id: newUser._id });
      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      await newUser.save();

      res.json({
        message: "Register successful.",
        access_token,
        user: {
          ...newUser._doc,
          password: "",
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // LOGIN
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username }).populate(
        "followers following",
        "avatar username name followers following"
      );
      if (!user) {
        return res.status(400).json({ message: "User does not exist." });
      }
      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshToken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful.",
        access_token,
        user: { ...user._doc, password: "" },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // logout
  logout: (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/api/refresh_token" });
      return res.status(200).json({ message: "Successfully logged out." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(400).json({ message: "Please login now.." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err)
            return res.status(400).json({ message: "Please login now." });

          const user = await User.findById(result.id)
            .select("-password")
            .populate(
              "followers following",
              "avatar username name followers following"
            );
          if (!user)
            return res.status(400).json({ message: "User does not exist." });

          const access_token = createAccessToken({ id: result.id });

          res.json({
            access_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = AuthController;
