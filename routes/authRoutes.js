const express = require("express");
const { isUserAuthorized, LoginController, logOutController, refreshTokenController, RegisterController, ResetPassword } = require("../controllers/authController.js");

const authRouter = express.Router();

authRouter.post("/login", LoginController);
authRouter.post("/register", RegisterController);
authRouter.post("/reset-password", ResetPassword);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logOutController);
authRouter.get("/dashboard", isUserAuthorized);

module.exports = authRouter;