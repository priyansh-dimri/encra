const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const logger = require("../utils/logger");

module.exports = (socket) => {
  socket.on("joinRoom", async (roomId) => {
    if (!mongoose.isValidObjectId(roomId)) {
      logger.error(`Socket ${socket.id} sent invalid room ID: ${roomId}`);
      return socket.emit("room:join_error", "Invalid room ID");
    }

    try {
      const room = await ChatRoom.findOne({
        _id: roomId,
        participants: socket.userId,
      });

      if (!room) {
        logger.warn(
          `Socket ${socket.id} (user ${socket.userId}) attempted to join unauthorized room ${roomId}`
        );
        return socket.emit("room:join_error", "Unauthorized to join this room");
      }

      socket.join(roomId);
      logger.info(
        `Socket ${socket.id} (user ${socket.userId}) joined room ${roomId}`
      );
    } catch (err) {
      logger.error(`Socket ${socket.id} DB error while joining room: ${err}`);
      socket.emit("room:join_error", "Server error while joining room");
    }
  });
};
