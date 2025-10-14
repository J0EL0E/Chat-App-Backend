    // models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: {type: String, required: true},
    //{ type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  senderId: {type: String, required: true},
  //{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  type: { type: String, enum: ["text", "audio", "image"], default: "text" },
  // audioUrl: { type: String },
  // translatedText: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
});

const messageModel =  mongoose.model("Message", messageSchema);
module.exports = messageModel;
