const Router = require("express").Router();
const PostController = require("../controllers/post.controller");
const auth = require("../middleware/auth.middleware");

Router.route("/posts")
  .post(auth, PostController.createPost)
  .get(auth, PostController.getPosts);
Router.route("/post/:id")
  .patch(auth, PostController.updatePost)
  .get(auth, PostController.getPost)
  .delete(auth, PostController.deletePost);

Router.patch("/post/:id/like", auth, PostController.likePost);
Router.patch("/post/:id/unlike", auth, PostController.unlikePost);

Router.get("/user_posts/:id", auth, PostController.getUserPosts);
Router.get("/post_discover", auth, PostController.discoverPosts);

Router.patch("/post/:id/save", auth, PostController.savePost);
Router.patch("/post/:id/unsave", auth, PostController.unsavePost);
Router.get("/saved", auth, PostController.getSavedPosts);

module.exports = Router;
