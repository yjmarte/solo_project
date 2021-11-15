const Router = require("express").Router();
const AuthController = require("../controllers/auth.controller");

Router.post("/login", AuthController.login);
Router.post("/register", AuthController.register);
Router.post("/logout", AuthController.logout);
Router.post("/refresh_token", AuthController.generateAccessToken);

module.exports = Router;
