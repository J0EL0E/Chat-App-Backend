const authRouter = require("./authRoutes.js");
const chatRouter = require("./chatRoute.js");
const dashboardRouter = require("./dashboardRoute.js");
const messageRouter = require("./messageRoute.js");
const fileUploadRouter = require("./fileUploadRoute.js")



module.exports = {chatRouter, authRouter, dashboardRouter, messageRouter, fileUploadRouter};