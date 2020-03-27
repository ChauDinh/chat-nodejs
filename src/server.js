const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/formatMessage");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/userList");

const app = express();
const PORT = process.env.PORT || 3000;

// Static folder
app.use(express.static(path.join(__dirname, "public")));

const httpServer = http.createServer(app);
const io = socketio(httpServer);

const botName = "ChatCord Bot";

// Run when client connect
io.on("connection", socket => {
  // Join room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Send data (message) back to the client (single client)
    socket.emit(
      "message",
      formatMessage(botName, `Welcome ${username} to ${room}`)
    );

    // Broadcast when a user connects (to all other clients except the user)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Listing users in room
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Send data (message) to all clients in general
  // io.emit();

  // Listen for chatMessage
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Update the user list in chatroom
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

httpServer.listen(PORT, () => console.log(`Server is runing on ${PORT} 🎉`));
