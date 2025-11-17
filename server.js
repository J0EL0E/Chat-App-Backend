const express = require("express");
const {Server} = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./config/database.js");
const {chatRouter, authRouter, dashboardRouter, messageRouter, fileUploadRouter } = require("./routes/index.js");
const {handleDisconnect, handleJoinChat, handleSendMessage, handleDeleteMessage, handleUpdateMessage} = require("./utils/socketHandlers.js");
const app = express();
const port = 4000;

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // allow request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};



connectToMongoDB();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", dashboardRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/", fileUploadRouter);   
app.use("/api/v1/uploads", express.static("uploads"));

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
    handleJoinChat(socket, chatId);
  });

  // Handle new messages
  socket.on("send_message", async (data) => {
    await handleSendMessage(socket, io, data);
  });

     socket.on('update_message', (data) => {
      handleUpdateMessage(socket, io, data);
    });

    // Handle deleting a message
    socket.on('delete_message', (data) => {
      handleDeleteMessage(socket, io, data);
    });

  // Handle disconnection
  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });
});

// Error handling for socket.io
io.engine.on("connection_error", (err) => {
  console.error("Socket.io connection error:", err);
});