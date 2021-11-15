const Router = require("express").Router();
const CommentController = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");

Router.post("/comment", auth, CommentController.create);

Router.patch("/comment/:id", auth, CommentController.update);

Router.patch("/comment/:id/like", auth, CommentController.like);

Router.patch("/comment/:id/unlike", auth, CommentController.unlike);

Router.delete("/comment/:id", auth, CommentController.delete);

module.exports = Router;
