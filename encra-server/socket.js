const { Server } = require("socket.io");
const logger = require("./utils/logger");
const auth = require("./middlewares/socketAuth");
const joinRoom = require("./handlers/joinRoom");
const sendMsg = require("./handlers/sendMessage");
const onDisconnect = require("./handlers/disconnect");
const rateLimiter = require("./middlewares/socketRateLimiter");

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

    joinRoom(socket);
    sendMsg(io, socket);
    onDisconnect(socket);
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
