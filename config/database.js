const mongoose = require("mongoose");

const mongoDBUri = "mongodb://127.0.0.1:27017"
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoDBUri);
        console.log("Connected to DB:", mongoDBUri); 
    } catch (error) {
        console.error(`Cannot connect to ${mongoDBUri}`)
        throw new Error(`Cannot connect to ${mongoDBUri}`)
    }
}

module.exports = {connectToMongoDB}