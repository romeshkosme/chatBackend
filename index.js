const express = require("express");
const app = express();
const routes = require("./helper/route");
const connectDb = require("./helper/dbConfig");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
app.use(cors({
  origin: process.env.NODE_ENV === "DEV" ? "http://127.0.0.1:5173" : "https://chatbackend-production-c208.up.railway.app/",
  optionsSuccessStatus: 200
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
connectDb();
app.use(routes);
//error handling
const server = app.listen(8080, () => {
  console.log("SERVER RUNNING AT 8080");
});

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: process.env.NODE_ENV === "DEV" ? "http://127.0.0.1:5173" : "https://chatbackend-production-c208.up.railway.app/",
  },
});
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("new message", (msg) => {
    console.log("new msg",msg)
    let chat = msg.chat;
    if (!chat.users) {
      return console.log("chat.user not defined!");
    }
    chat.users.forEach((user) => {
      if (user === msg.sender._id) {
        return;
      }
      socket.in(user).emit("message recieved", msg);
    });
  });
  socket.off("setup", () => {
    console.log("user disconnected")
    socket.leave(userData)
  })
});
