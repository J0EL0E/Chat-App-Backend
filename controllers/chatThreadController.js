const {generateUUID} = require("../lib/generateUUID.js");
const  chatThread  = require("../model/chatThreadModel.js");

const createChatThreads = async(req, res, next) => {
    try{
        const {participants, threadName, createdBy} = req.body

        const chatId = generateUUID();   // generate uuid for the chatid;
        
        let chatThreadParams = {
            chatId: chatId,
            admin: createdBy, // the user that created the conversation will be the admin
            participants: participants,
            threadName: threadName,
            isGroup: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }

        if(!participants){
            return res.status(400).json({
                status: "error",
                message: "There's should be at least one receiver."
            });
        }

        if(!threadName){
            let temporaryThreadName;
            const listOfParticipants = participants.split(",");
            listOfParticipants.forEach((participant, index) => {
                if(index <= participants.length){
                    temporaryThreadName += `${participant}, `
                } else {
                    temporaryThreadName += `${participant}`
                }
            });
            console.log(temporaryThreadName);
            chatThreadParams.threadName = temporaryThreadName;
        }

        if(participants.length > 1){
            chatThreadParams.isGroup = true;
        }

        const newChat = new chatThread(chatThreadParams);
        const test = await newChat.save();
        
        res.status(201).json({
            status: "success",
            message: "The new chat thread is created successfully.",
            chatId: chatId
        })

    } catch(error) {
        console.log("Unable to generate new Chat thread.", error);
        next();
    }
    
}

const filterChatByThreadName = async (req, res, next) => {
    try{
        const {thread_name} = req.query;

        if(thread_name) {
            return res.status(400).json({
                status: "error",
                message: "The chat thread name is required."
            });
        }

        const query = await chatThread.find({threadName: thread_name});

        if(query){
            res.status(200).json({
                status: "success",
                message: "The chat thread is retrieved successfully.",
                data: query
            })
        }

    } catch{
        console.log("Failed to retrieve the chat thread.", error);
        next();
    }
}

const leaveChatThread = async (req, res, next) => {
    try {
        const {userId, chatId} = req.body;

        if(!userId || !chatId){
              return res.status(400).json({
                status: "error",
                message: "The chatId and userId is required."
            });
        }

        const chatThreadToLeave = await chatThread.findOneandUpdate({chatId: chatId}, {$set: {participants: 
            participants.filter(participant => participant !== userId)
        }});

        if(chatThreadToLeave) {
            res.status(200).json({
                status: "success",
                message: "Left chat successfully."
            })
        }
    } catch (error){
        console.log("Failed to leave chat.", error);
        next();
    }
}

const deleteChatThread = async (req, res, next) => {
  try {
    const {userId, chatId} = req.body;

    if(!userId || !chatId){
          return res.status(404).json({
            status: "error",
            message: "The chatId and userId is required."
        });
    }

    // Find chat thread
    const chatThread = await Chat.findById(chatId);
    if (!chatThread) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }
    const isAdmin = chatThread.admin.find(participant => participant === userId)
    if(isAdmin) {
        // Delete all messages linked to this thread
        await Message.deleteMany({ _id: { $in: chatThread.messages } });
    
        // Delete the chat thread itself
        await Chat.findByIdAndDelete(chatId);
    }

    return res.status(200).json({ status: "success", message: "Chat thread deleted" });

    } catch (error) {
        console.error("Delete chat error:", error);
        next();
    }
}

module.exports = {
    createChatThreads,
    filterChatByThreadName,
    leaveChatThread,
    deleteChatThread
}