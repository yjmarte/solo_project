const Post = require("../models/post.model");
// const Comment = require('../models/comment.model')
const User = require("../models/user.model");

class Pagination {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const PostController = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (images.length === 0)
        return res.status(400).json({ message: "Please add a photo." });

      const newPost = new Post({ content, images, user: req.user._id });

      await newPost.save();

      res.json({
        message: "Successfully created post.",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const pagination = new Pagination(
        Post.find({ user: [...req.user.following, req.user._id] }),
        req.query
      ).paginate();

      const posts = await pagination.query
        .sort("-createdAt")
        .populate("user likes", "avatar username name followers")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });

      res.json({
        message: "Created post.",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate("user likes", "avatar username name")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });

      res.json({
        message: "Updated post.",
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id, likes: req.user._id });
      if (post.length > 0)
        return res
          .status(400)
          .json({ message: "You already liked this post." });

      const like = await Post.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
      if (!like)
        return res.status(400).json({ message: "This post does not exist." });

      res.json({ message: "Liked post." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unlikePost: async (req, res) => {
    try {
      const like = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.use._id },
        },
        { new: true }
      );
      if (!like)
        return res.status(400).json({ message: "This post does not exists." });

      res.json({ message: "Unliked post." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const pagination = new Pagination(
        Post.find({ user: req.params.id }),
        req.query
      ).paginate();
      const posts = await pagination.query.sort("-createdAt");

      res.json({ posts, result: posts.length });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user likes", "avatar username name followers")
        .populate({
          path: "comments",
          populate: { path: "comments", select: "-password" },
        });
      if (!post)
        return res.status(400).json({ message: "This post does not exist." });

      res.json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  discoverPosts: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 9;
      const posts = await Post.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]);

      return res.json({
        message: "Discovered posts.",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comment.deleteMany({ _id: { $in: post.comments } });

      res.json({
        message: "Post deleted.",
        newPost: {
          ...post,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  savePost: async (req, res) => {
    try {
      const user = await User.find({ _id: req.user._id, saved: req.params.id });
      if (user.length > 0)
        return res
          .status(400)
          .json({ message: "You already saved this post." });

      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );
      if (!save)
        return res.status(400).json({ message: "This user does not exist." });

      res.json({ message: "Post saved." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unsavePost: async (req, res) => {
    try {
      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );
      if (!save)
        return res.status(400).json({ message: "This user does not exist." });

      res.json({ message: "Post unsaved." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getSavedPosts: async (req, res) => {
    try {
      const pagination = new Pagination(
        Post.find({ _id: { $in: req.user.saved } }),
        req.query
      ).paginate();

      const saved = await pagination.query.sort("-createdAt");

      res.json({
        saved,
        result: saved.length,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = PostController;
