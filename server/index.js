/**
 * KSVID Chat Application - Server Entry Point
 * A real-time chat application using Express.js, Socket.io and MongoDB
 * Author: Kirety
 */
// NMKRSPVLIDATA
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();

// Import route handlers
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const fileRoutes = require("./routes/fileRoutes");

// Initialize Express app
const app = express();

// CORS configuration - Allow both production and development origins
app.use(cors({
  origin: [
    'https://nmkrspvlidata.netlify.app', 
    'http://localhost:5173', 
    'http://localhost:5176',
    /^http:\/\/localhost:\d+$/  // Allow any localhost port for development
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/files", fileRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: "KSVID Chat Server is running successfully!" });
});

// Database connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 KSVID Chat Server running on port ${PORT}`);
});

// Socket.io configuration
const io = socket(server, {
  cors: {
    origin: ['https://nmkrspvlidata.netlify.app', 'http://localhost:5173','http://localhost:5174','http://localhost:5177','http://localhost:5176','http://localhost:5175'],
    credentials: true,
  },
});

// Store online users
global.onlineUsers = new Map();

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log(`🟢 New socket connected: ${socket.id}`);

  // Add user to online users list
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`� User ${userId} connected`);
  });

  // Handle message sending
  socket.on("send-msg", (data) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("msg-receive", data.message);
      console.log(`📤 Message sent from ${data.from} to ${data.to}`);
    }
  });

  // Handle voice call initiation
  socket.on("voice-call", (data) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("incoming-voice-call", {
        from: data.callerName || data.from,
        fromUserId: data.from,
        roomId: data.roomId,
        callerId: socket.id,
        signal: data.signal
      });
      console.log(`📞 Voice call initiated from ${data.callerName || data.from} to user ${data.to}`);
    }
  });

  // Handle video call initiation
  socket.on("video-call", (data) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("incoming-video-call", {
        from: data.callerName || data.from,
        fromUserId: data.from,
        roomId: data.roomId,
        callerId: socket.id,
        signal: data.signal
      });
      console.log(`📹 Video call initiated from ${data.callerName || data.from} to user ${data.to}`);
    }
  });

  // Handle call acceptance
  socket.on("accept-call", (data) => {
    const callerSocketId = onlineUsers.get(data.to);
    if (callerSocketId) {
      socket.to(callerSocketId).emit("call-accepted", {
        signal: data.signal,
        from: data.from
      });
      console.log(`✅ Call accepted by ${data.from}`);
    }
  });

  // Handle call rejection
  socket.on("reject-call", (data) => {
    const callerSocketId = onlineUsers.get(data.to);
    if (callerSocketId) {
      socket.to(callerSocketId).emit("call-rejected", {
        from: data.from
      });
      console.log(`❌ Call rejected by ${data.from}`);
    }
  });

  // Handle call end
  socket.on("end-call", (data) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("call-ended", {
        from: data.from
      });
      console.log(`📴 Call ended by ${data.from}`);
    }
  });

  // Handle WebRTC signaling
  socket.on("signal", (data) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      socket.to(recipientSocketId).emit("signal", {
        signal: data.signal,
        from: data.from
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    // Remove user from online users list
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`👤 User ${userId} disconnected`);
        break;
      }
    }
  });
});

module.exports = app;