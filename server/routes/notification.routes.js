const Router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const NotificationController = require("../controllers/notification.controller");

Router.post("/notification", auth, NotificationController.create);
Router.delete("/notification/:id", auth, NotificationController.delete);
Router.get("/notifications", auth, NotificationController.get);
Router.patch("/notification/:id", auth, NotificationController.read);
Router.delete(
  "/deleteAllNotifications",
  auth,
  NotificationController.deleteAll
);

module.exports = Router;
