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
