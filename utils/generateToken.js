const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../model/userModel.js");
const refreshTokenModel = require("../model/tokenModel.js")

const generateResetPasswordToken = async (email) => {

    const user = User.findOne({email: email});
    if(!user){
        throw new Error("User doesn't exist.");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const resetUrl = `${process.env.API_HOST}/reset-password/${token}`;
    return resetUrl;
} 


function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const newRefreshToken = new refreshTokenModel({token: refreshToken})
  newRefreshToken.save()
  return refreshToken;
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken
}