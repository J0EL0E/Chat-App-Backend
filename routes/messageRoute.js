const {Router} = require("express");
const { findMessageById, updateMessageById, deleteMessageById } = require("../controllers/messageController.js");

const messageRouter = Router();

messageRouter.get("/:messageId", findMessageById );
messageRouter.put("/update", updateMessageById);
messageRouter.delete("/delete/:messageId", deleteMessageById);

module.exports = messageRouter;