const {Router} = require("express");
const { createChatThreads, filterChatByThreadName, leaveChatThread, deleteChatThread, filterChatByUsers, filterChatById } = require("../controllers/chatThreadController");

const chatRouter = Router();

chatRouter.post("/create", createChatThreads);
chatRouter.get("/all", filterChatByUsers)
chatRouter.get("/:chatId", filterChatById)
chatRouter.get("/filter", filterChatByThreadName);
chatRouter.put("/leave", leaveChatThread);
chatRouter.delete("/delete", deleteChatThread);

module.exports = chatRouter