const {Router} = require("express");
const { createChatThreads, filterChatByThreadName, leaveChatThread, deleteChatThread } = require("../controllers/chatThreadController");

const chatRouter = Router();

chatRouter.post("/chat/create", createChatThreads);
chatRouter.get("/chat/filter", filterChatByThreadName);
chatRouter.put("/chat/leave", leaveChatThread);
chatRouter,delete("/chat/delete", deleteChatThread);

module.exports = chatRouter