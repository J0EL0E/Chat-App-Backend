const {Router} = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { getUserChatThreads } = require("../controllers/dashboardController.js");

const dashboardRouter = Router();

dashboardRouter.get("/dashboard",  authMiddleware, getUserChatThreads);

module.exports = dashboardRouter;
