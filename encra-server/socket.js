const { Server } = require("socket.io");
const logger = require("./utils/logger");
const auth = require("./middlewares/socketAuth");
const joinRoom = require("./handlers/joinRoom");
const sendMsg = require("./handlers/sendMessage");
const onDisconnect = require("./handlers/disconnect");
const rateLimiter = require("./middlewares/socketRateLimiter");
const { addOnlineUser } = require("./utils/onlineUsers");
const deleteMessage = require("./handlers/deleteMessage");
const deleteConversation = require("./handlers/deleteConversation");

let ioInstance = null;

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  io.use(auth);
  io.use(rateLimiter);

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id} (user ${socket.userId})`);

    addOnlineUser(socket.userId, socket.id);

    joinRoom(socket);
    sendMsg(io, socket);
    deleteMessage(io, socket);
    deleteConversation(io, socket);
    onDisconnect(socket);
  });
  io.on("connection_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  ioInstance = io;
  return io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io instance not initialized yet");
  }
  return ioInstance;
}

module.exports = { initSocketServer, getIO };
