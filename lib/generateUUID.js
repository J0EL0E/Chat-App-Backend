const crypto = require("crypto");

 function generateUUID() {
    const uuid = crypto.randomBytes(16).toString('hex');
    return uuid;
}

module.exports = {
    generateUUID
}