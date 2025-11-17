const chatThread = require("../model/chatThreadModel.js");

const getUserChatThreads  = async (req, res, next) => {
    try {
        const {username, email} = req.user;
        // if(userChats.length > 0){
            res.status(200).json({userDetails: req.user})
        // }

    


    } catch (error){
        console.log("User data doesn't exist")
        next();
    }
}


module.exports = {getUserChatThreads};