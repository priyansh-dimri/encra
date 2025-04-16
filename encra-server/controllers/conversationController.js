// controllers/conversationController.js
const Conversation = require("../models/ChatRoom");
const logger = require("../utils/logger");

exports.getConversations = async (req, res) => {
  try {
    logger.info(`Fetching conversations for userId: ${req.userId}`);

    const conversations = await Conversation.find({ participants: req.userId })
      .populate("participants", "username email")
      .populate("latestMessage");

    logger.info(
      `Found ${conversations.length} conversations for userId: ${req.userId}`
    );
    res.status(200).json(conversations);
  } catch (error) {
    logger.error(
      `Error fetching conversations for userId: ${req.userId} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};

exports.startConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    logger.info(
      `User ${req.userId} attempting to start conversation with ${participantId}`
    );

    if (participantId === req.userId) {
      logger.warn(`User ${req.userId} tried to start conversation with self.`);
      return res.status(400).json({ message: "Invalid participant." });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, participantId] },
    });

    if (!conversation) {
      logger.info(
        `No existing conversation. Creating new conversation between ${req.userId} and ${participantId}`
      );
      conversation = await Conversation.create({
        participants: [req.userId, participantId],
      });
    } else {
      logger.info(
        `Existing conversation found between ${req.userId} and ${participantId}`
      );
    }

    res.status(201).json(conversation);
  } catch (error) {
    logger.error(
      `Error starting conversation for userId: ${req.userId} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};
