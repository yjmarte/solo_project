const Router = require("express").Router();
const UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

Router.get("/search", auth, UserController.search);
Router.get("/profile/:id", auth, UserController.get);

Router.patch("/profile", auth, UserController.update);
Router.patch("/profile/:id/follow", auth, UserController.follow);
Router.patch("/profile/:id/unfollow", auth, UserController.unfollow);

Router.get("/suggestions", auth, UserController.suggestions);

module.exports = Router;
