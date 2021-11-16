const User = require("../models/user.model");
const cloudinary = require("cloudinary").v2;

const UserController = {
  // Search
  search: async (req, res) => {
    try {
      const users = await User.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("name username avatar");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Get
  get: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");
      if (!user) {
        return res.status(400).json({ message: "User does not exist." });
      } else {
        return res.json({ user });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Update
  update: async (req, res) => {
    try {
      const { avatar, name, bio } = req.body;

      if (!name)
        return res.status(400).json({ message: "Please add your name." });

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          name,
          bio,
        }
      );

      return res.json({ message: "Update successful." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Delete
  delete: async (req, res) => {
    try {
    } catch (err) {}
  },

  // Follow
  follow: async (req, res) => {
    try {
      const user = await User.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res
          .status(500)
          .json({ message: "Already following this user." });

      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      return res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Unfollow
  unfollow: async (req, res) => {
    try {
      const newUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate("followers following", "-password");

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      return res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // Suggestions
  suggestions: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 10;

      const users = await User.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = UserController;
