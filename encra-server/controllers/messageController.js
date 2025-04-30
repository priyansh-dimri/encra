const Message = require("../models/Message");
const logger = require("../utils/logger");
const { getIO } = require("../socket");

exports.getMessages = async (req, res) => {
  try {
    const conversationId = req.conversation._id;
    const query = { chat: conversationId };
    const limit = parseInt(req.query.limit, 10) || 20;
    const before = req.query.before;
    console.log(before);
    console.log(req.query);

    logger.info(
      `Fetching messages for conversationId: ${conversationId} with limit: ${limit}, before: ${
        before || "N/A"
      }`
    );

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    logger.info(
      `Fetched ${messages.length} messages for conversationId: ${conversationId}`
    );

    res.status(200).json(messages);
  } catch (error) {
    logger.error(
      `Error fetching messages for conversationId: ${req.conversation._id} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const conversationId = req.conversation._id;

    const message = await Message.findOne({
      _id: messageId,
      chat: conversationId,
    });

    if (!message) {
      logger.warn(
        `Message ${messageId} not found in conversation ${conversationId}`
      );
      return res.status(404).json({ message: "Message not found" });
    }

    await message.deleteOne();

    logger.info(
      `Message ${messageId} deleted from conversation ${conversationId}`
    );

    logger.info(`Emitting message:delete to room ${conversationId}`);
    const socketsInRoom = await getIO().in(conversationId.toString()).fetchSockets();

    logger.info(
      `Emitting message:delete to room ${conversationId} with ${
        socketsInRoom.length
      } connected sockets: ${socketsInRoom.map((s) => s.id).join(", ")}`
    );
    getIO().to(conversationId).emit("message:delete", { messageId });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting message: ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};
