const ConversationKey = require("../models/ConversationKey");

exports.fetchAndDeleteKey = async (req, res) => {
  try {
    const conversationId = req.conversation;
    const key = await ConversationKey.findOneAndDelete({
      conversationId,
      recipientId: req.userId,
    });

    if (!key) {
      return res.status(404).json({ message: "No key found" });
    }

    res.status(200).json(key);
  } catch (err) {
    logger.error(
      `Error fetching/deleting key for convo ${req.conversation}: ${err}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};
