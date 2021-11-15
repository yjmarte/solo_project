const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const CommentController = {
  create: async (req, res) => {
    try {
      const { postId, content, tag, replies, postUserId } = req.body;

      const post = await Post.findById(postId);
      if (!post)
        return res.status(400).json({ message: "This post does not exist." });

      if (replies) {
        const comment = await Post.findById(replies);
        if (!comment)
          return res
            .status(400)
            .json({ message: "This comment does not exist." });
      }
      const newComment = new Comment({
        user: req.user._id,
        content,
        tag,
        replies,
        postUserId,
        postId,
      });

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );

      await newComment.save();

      res.json({ newComment });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { content } = req.body;

      await Comment.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        { content }
      );

      res.json({ message: "Update succesful." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  like: async (req, res) => {
    try {
      const comment = await Comment.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (comment.length > 0)
        return res
          .status(400)
          .json({ message: "You already liked this comment." });

      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      res.json({ message: "Liked comment." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  unlike: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      res.json({ message: "Unliked comment." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.user._id }, { postUserId: req.user._id }],
      });

      await Post.findOneAndUpdate(
        { _id: comment.postId },
        {
          $pull: { comments: req.params.id },
        }
      );

      res.json({ message: "Deleted comment." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = CommentController;
