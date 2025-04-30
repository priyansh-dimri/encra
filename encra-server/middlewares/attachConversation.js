const Conversation = require("../models/ChatRoom");

module.exports = (source = "params") => {
  return async (req, res, next) => {
    const conversationId =
      source === "body" ? req.body.conversationId : req.params.conversationId;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required." });
    }

    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found." });
      }

      req.conversation = conversation;
      next();
    } catch (error) {
      console.error("Error in attachConversation middleware:", error);
      return res
        .status(500)
        .json({ message: "Server error checking conversation existence." });
    }
  };
};
