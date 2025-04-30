const mongoose = require("mongoose");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const logger = require("../utils/logger");

module.exports = (io, socket) => {
  socket.on("message:delete", async (data) => {
    const { messageId, conversationId } = data;

    if (
      !messageId ||
      !conversationId ||
      !mongoose.isValidObjectId(messageId) ||
      !mongoose.isValidObjectId(conversationId)
    ) {
      logger.warn(
        `Invalid deleteMessage payload from ${socket.id}: ${JSON.stringify(
          data
        )}`
      );
      return socket.emit("message:error", "Invalid delete request");
    }

    const chatRoom = await ChatRoom.findOne({
      _id: conversationId,
      participants: socket.userId,
    });

    if (!chatRoom) {
      logger.warn(
        `Unauthorized delete attempt by ${socket.userId} on ${conversationId}`
      );
      return socket.emit(
        "message:error",
        "Unauthorized to delete in this conversation"
      );
    }

    const message = await Message.findOne({
      _id: messageId,
      chat: conversationId,
    });

    if (!message) {
      return socket.emit("message:error", "Message not found");
    }

    try {
      await message.deleteOne();
      logger.info(
        `Message ${messageId} deleted by user ${socket.userId} from ${conversationId}`
      );
      io.to(conversationId).emit("message:delete", { messageId });
    } catch (err) {
      logger.error(`Error deleting message ${messageId}: ${err}`);
      socket.emit("message:error", "Server error during message deletion");
    }
  });
};
