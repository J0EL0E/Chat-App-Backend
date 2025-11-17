const messageModel = require("../model/messageModel.js");

const findMessageById = async (req, res) => {
    try{
        const {messageId} = req.params;
        const retrievedMessage = await messageModel.findById(messageId)

        if(retrievedMessage) {
            res.status(200).json({
                status: "success",
                message: "Message is retrieved successfully.",
                data: retrievedMessage,
            })
        } else {
            res.status(404).json({
                status: "error",
                message: "Message not Found",
            })
        }

    }
    catch (error) {
        res.status(200).json({
                status: "success",
                message: "Message isretrieved successfully.",
                data: retrievedMessage,
        })

    }
}
 
const updateMessageById = async (req, res) => {
    try{
        const {messageId, text} = req.body;
        console.log(req.body)
        const updatedMessage = await messageModel.findByIdAndUpdate(messageId, {text: text, updatedAt: new Date().toISOString()}, {new: true})

        if(updatedMessage) {
            res.status(200).json({
                status: "success",
                message: "Message is updated successfully.",
                data: updatedMessage,
            })
        } else {
            res.status(404).json({
                status: "error",
                message: "Message not Found",
            })
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).json({
                status: "error",
                message: "Unable to update the message.",
                error: error
        })

    }
    
}


const deleteMessageById = async (req, res) => {
    try{
        const {messageId} = req.params;
        const retrievedMessage = await messageModel.findByIdAndDelete(messageId)

        if(retrievedMessage) {
            res.status(200).json({
                status: "success",
                message: "Message is deleted successfully.",
            })
        } else {
            res.status(404).json({
                status: "error",
                message: "Message not Found",
            })
        }

    }
    catch (error) {
         res.status(500).json({
                status: "error",
                message: "Unable to delete the message.",
                error: error
        })

    }
}

module.exports = {findMessageById, updateMessageById, deleteMessageById }