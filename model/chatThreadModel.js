const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatId: { type: String, required: true},
  participants: [
    // { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    {
      type: String, required: true
    }
  ],
  admins: [
    // { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}
      {
      type: String, required: true
    }
  ], 
  isGroup: { type: Boolean, default: false },
  threadName: { type: String }, // only if isGroup = true
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // quick access
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // linked messages
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const chatThread = mongoose.model("Chat", chatSchema);
module.exports = chatThread;
