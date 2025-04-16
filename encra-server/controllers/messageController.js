const Message = require("../models/Message");
const logger = require("../utils/logger");

exports.getMessages = async (req, res) => {
  try {
    const conversationId = req.conversation._id;
    const query = { chat: conversationId };
    const limit = parseInt(req.query.limit, 10) || 20;
    const before = req.query.before;

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

exports.sendMessage = async (req, res) => {
  try {
    const conversationId = req.conversation._id;
    const { content, messageType } = req.body;

    logger.info(
      `User ${req.userId} sending message to conversationId: ${conversationId} - Type: ${messageType}`
    );

    const newMessage = await Message.create({
      chat: conversationId,
      sender: req.userId,
      content,
      messageType,
    });

    logger.info(
      `Message sent by user ${req.userId} in conversationId: ${conversationId} - MessageId: ${newMessage._id}`
    );

    res.status(201).json(newMessage);
  } catch (error) {
    logger.error(
      `Error sending message by user ${req.userId} in conversationId: ${req.conversation._id} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};
