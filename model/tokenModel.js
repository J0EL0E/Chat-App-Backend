const {Schema, model} = require("mongoose");

const refreshToken = new Schema({
    token:{
        type: String,
        required: true
    }

})

const refreshTokenModel = model("refreshToken", refreshToken, "refresh_tokens")
module.exports = refreshTokenModel;