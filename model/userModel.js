// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type:String, required:true},
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  profilePic: { type: String, default: "" }, // URL to profile picture
  agreeToTerms : {type: String, required: true},
  status: { type: String, default: "Hey there! I am using ChatApp." },
  lastSeen: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// 🔐 Password helper methods
userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const userModel = mongoose.model("User", userSchema, "users");
module.exports = userModel;

