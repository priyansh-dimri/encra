const mongoose = require("mongoose");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const logger = require("../utils/logger");

module.exports = (io, socket) => {
  socket.on("message:send", async (data) => {
    const { conversationId, content, messageType } = data;
    if (
      !conversationId ||
      !content ||
      !messageType ||
      !mongoose.isValidObjectId(conversationId)
    ) {
      logger.error(
        `Socket ${socket.id} invalid payload: ${JSON.stringify(data)}`
      );
      return socket.emit("message:error", "Invalid message data");
    }

    const chatRoom = await ChatRoom.findOne({
      _id: conversationId,
      participants: socket.userId,
    });

    if (!chatRoom) {
      logger.warn(`Unauthorized message send attempt by ${socket.userId}`);
      return socket.emit(
        "message:error",
        "Unauthorized to send message to this conversation"
      );
    }

    const allowedTypes = ["text"];
    if (!allowedTypes.includes(messageType)) {
      return socket.emit("message:error", "Invalid message type");
    }

    if (typeof content !== "string" || content.length > 10000) {
      return socket.emit("message:error", "Invalid encrypted message blob");
    }

    try {
      const newMsg = await Message.create({
        chat: conversationId,
        sender: socket.userId,
        content,
        messageType,
      });

      io.to(conversationId).emit("message:receive", newMsg);
      logger.info(`Socket ${socket.id} saved & broadcasted msg ${newMsg._id}`);
    } catch (err) {
      logger.error(`Socket ${socket.id} DB error: ${err}`);
      socket.emit("message:error", "Server error saving message");
    }
  });
};
