const Notification = require("../models/notification.model");

const NotificationController = {
  create: async (req, res) => {
    try {
      const { id, recipients, url, text, content, image } = req.body;
      if (recipients.includes(req.user._id.toString())) return;

      const notification = new Notification({
        id,
        recipients,
        url,
        text,
        content,
        image,
        user: req.user._id,
      });

      await notification.save();
      return res.json({ notification });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const notification = await Notification.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });

      return res.json({ notification });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  get: async (req, res) => {
    try {
      const notifications = await Notification.find({
        recipients: req.user._id,
      })
        .sort("-createdAt")
        .populate("user", "avatar name");

      return res.json({ notifications });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  read: async (req, res) => {
    try {
      const notifications = await Notification.findOneAndUpdate(
        { _id: req.params.id },
        { read: true }
      );

      return res.json({ notifications });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteAll: async (req, res) => {
    try {
      const notifications = await Notification.deleteMany({
        recipients: req.user._id,
      });

      return res.json({ notifications });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = NotificationController;
