const express = require("express");
const {Server} = require("socket.io");
const cors = require("cors");
const { connectToMongoDB } = require("./config/database.js");
const chatRouter = require("./routes/chatRoute.js");
const messageModel = require("./model/messageModel.js");
const app = express();
const port = 4000;

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: "*"
  // function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // }
}


connectToMongoDB();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(cors(corsOptions));

app.use("/api/v1", chatRouter);

const expressServer = app.listen(port, () => {
    console.log(`Listening from port: ${port}`)
})


const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Handle new messages
  socket.on("send_message", async (data) => {
    const { chatId, senderId, text } = data;

    // Save to DB
    const newMessage = await messageModel.create({
      chatId,
      senderId,
      text
    });

    // Emit to everyone in that chat room
    io.to(chatId).emit("new_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});