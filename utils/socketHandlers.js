const messageModel = require('../model/messageModel.js');
const chatThread = require('../model/chatThreadModel.js');
const { generateUUID } = require('../lib/generateUUID.js');

/**
 * Handle user joining a chat room
 */
const handleJoinChat = (socket, chatId) => {
  socket.join(chatId);
  console.log(`User ${socket.id} joined chat ${chatId}`);
};

/**
 * Handle sending a new message
 */
const handleSendMessage = async (socket, io, data) => {
  const { chatId, senderId, text, id, messageType, src} = data;
  console.log("message data", data);

  // Validate input
  if(messageType !== 'text'){
    if (!chatId || !senderId || !src?.trim()) {
      socket.emit("message_error", { 
        error: "Invalid message data. ChatId, senderId, and source are required." 
      });
    } 
  } else {
    if (!chatId || !senderId || !text?.trim()) {
      socket.emit("message_error", { 
        error: "Invalid message data. ChatId, senderId, and text are required." 
      });
      return;
    }
  }

  try {
    // Create and save the message
    let newMessage;
    if(messageType === 'text'){
      newMessage = await messageModel.create({
        chatId,
        senderId,
        text: text.trim()
      });    
    } else {
        newMessage = await messageModel.create({
        chatId,
        senderId,
        type: messageType,
        src
      });
    }

    console.log("new Message", newMessage)

    // Update chat thread with message reference
    const updatedChat = await chatThread.findOneAndUpdate(
      { chatId : chatId},
      { 
        $push: { messages: newMessage._id },
        lastMessage: newMessage._id,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedChat) {
      console.error(`Chat thread not found: ${chatId}`);
      socket.emit("message_error", { error: "Chat thread not found" });
      return;
    }

    // Emit message to all users in the chat room
    io.to(id).emit("new_message", newMessage);
    
    console.log(`Message sent in chat ${chatId} by user ${senderId}`);
  } catch (error) {
    console.error("Error handling send_message:", error);
    socket.emit("message_error", { 
      error: "Failed to send message. Please try again." 
    });
  }
};

/**
 * Handle updating a message
 */
const handleUpdateMessage = async (socket, io, data) => {
  const { messageId, text, chatId } = data;

  // Validate input
  if (!messageId || !text?.trim() || !chatId) {
    socket.emit("message_error", { 
      error: "Invalid update data. MessageId, chatId, and text are required." 
    });
    return;
  }

  try {
    // Update the message in database
    const updatedMessage = await messageModel.findByIdAndUpdate(
      messageId,
      { 
        text: text.trim(), 
        updatedAt: Date.now(),
        isEdited: true 
      },
      { new: true }
    );

    if (!updatedMessage) {
      console.error(`Message not found: ${messageId}`);
      socket.emit("message_error", { error: "Message not found" });
      return;
    }

    // Emit update to all users in the chat room
    io.to(chatId).emit("message_updated", updatedMessage);
    
    console.log(`Message ${messageId} updated in chat ${chatId}`);
  } catch (error) {
    console.error("Error handling update_message:", error);
    socket.emit("message_error", { 
      error: "Failed to update message. Please try again." 
    });
  }
};

/**
 * Handle deleting a message
 */
const handleDeleteMessage = async (socket, io, data) => {
  const { messageId, chatId } = data;

  // Validate input
  if (!messageId || !chatId) {
    socket.emit("message_error", { 
      error: "Invalid delete data. MessageId and chatId are required." 
    });
    return;
  }

  try {
    // Delete the message from database
    const deletedMessage = await messageModel.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      console.error(`Message not found: ${messageId}`);
      socket.emit("message_error", { error: "Message not found" });
      return;
    }

    // Remove message reference from chat thread
    await chatThread.findOneAndUpdate(
      { chatId: chatId },
      { 
        $pull: { messages: messageId },
        updatedAt: Date.now()
      }
    );

    // Emit deletion to all users in the chat room
    io.to(chatId).emit("message_deleted", messageId);
    
    console.log(`Message ${messageId} deleted from chat ${chatId}`);
  } catch (error) {
    console.error("Error handling delete_message:", error);
    socket.emit("message_error", { 
      error: "Failed to delete message. Please try again." 
    });
  }
};

/**
 * Handle user disconnection
 */
const handleDisconnect = (socket) => {
  console.log("User disconnected:", socket.id);
};

module.exports = {
  handleJoinChat,
  handleSendMessage,
  handleDisconnect, 
  handleUpdateMessage,
  handleDeleteMessage
};
