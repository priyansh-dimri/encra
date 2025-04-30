const mongoose = require("mongoose");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const logger = require("../utils/logger");

module.exports = (io, socket) => {
  socket.on("conversation:delete", async (data) => {
    const { conversationId } = data;

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
      logger.warn(
        `Invalid deleteConversation payload from ${socket.id}: ${JSON.stringify(
          data
        )}`
      );
      return socket.emit("conversation:error", "Invalid delete request");
    }

    const chatRoom = await ChatRoom.findOne({
      _id: conversationId,
      participants: socket.userId,
    });

    if (!chatRoom) {
      logger.warn(
        `Unauthorized conversation delete attempt by ${socket.userId}`
      );
      return socket.emit(
        "conversation:error",
        "Unauthorized to delete this conversation"
      );
    }

    try {
      await chatRoom.deleteOne();
      await Message.deleteMany({ chat: conversationId });

      logger.info(`Conversation ${conversationId} deleted by ${socket.userId}`);
      io.to(conversationId).emit("conversation:delete", { conversationId });
    } catch (err) {
      logger.error(`Error deleting conversation ${conversationId}: ${err}`);
      socket.emit(
        "conversation:error",
        "Server error during conversation deletion"
      );
    }
  });
};
