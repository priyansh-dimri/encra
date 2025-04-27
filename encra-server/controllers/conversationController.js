const Conversation = require("../models/ChatRoom");
const ConversationKey = require("../models/ConversationKey");
const logger = require("../utils/logger");
const { getIO } = require("../socket");
const { getUserSockets } = require("../utils/onlineUsers");
const User = require("../models/User");

exports.getConversations = async (req, res) => {
  try {
    logger.info(`Fetching conversations for userId: ${req.userId}`);

    const conversations = await Conversation.find({ participants: req.userId })
      .populate("latestMessage")
      .lean();

    const populatedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participants.find(
          (id) => id.toString() !== req.userId
        );

        const otherUser = await User.findById(otherParticipantId)
          .select("username name")
          .lean();

        // Inject otherUser inside conversation
        return {
          ...conversation,
          otherUser: {
            _id: otherUser._id,
            username: otherUser.username,
            name: otherUser.name,
          },
        };
      })
    );

    logger.info(
      `Found ${conversations.length} conversations for userId: ${req.userId}`
    );
    res.status(200).json(populatedConversations);
  } catch (error) {
    logger.error(
      `Error fetching conversations for userId: ${req.userId} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};

exports.startConversation = async (req, res) => {
  try {
    const { participantId, encryptedAESKey, signature } = req.body;
    const userId = req.userId;

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

    let createdNewConvo = false;

    const otherUser = await User.findById(participantId)
      .select("username name")
      .lean();

    if (!conversation) {
      if (!encryptedAESKey) {
        return res.status(400).json({ message: "Missing encryptedAESKey" });
      }

      logger.info(
        `No existing conversation. Creating new conversation between ${req.userId} and ${participantId}`
      );
      conversation = await Conversation.create({
        participants: [req.userId, participantId],
      });

      // Store the encrypted AES 256 key in ConversationKey model
      await ConversationKey.create({
        conversationId: conversation._id,
        recipientId: participantId,
        encryptedKey: encryptedAESKey,
        senderId: userId,
        signature: signature,
      });

      // Notify the recipient using the socket id
      const recipientSockets = getUserSockets(participantId);
      const io = getIO();

      for (const socketId of recipientSockets) {
        io.to(socketId).emit("conversation:invite", {
          conversationId: conversation._id,
          from: req.userId,
        });
      }
      createdNewConvo = true;
    } else {
      logger.info(
        `Existing conversation found between ${req.userId} and ${participantId}`
      );
    }

    const convo = conversation.toObject();

    res.status(201).json({
      ...convo,
      otherUser,
      created: createdNewConvo,
    });
  } catch (error) {
    logger.error(
      `Error starting conversation for userId: ${req.userId} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversationId = req.conversation;

    logger.info(
      `User ${req.userId} attempting to delete conversation ${conversationId}`
    );

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId,
    });

    if (!conversation) {
      logger.warn(
        `Conversation ${conversationId} not found or user ${req.userId} not authorized`
      );
      return res.status(404).json({ message: "Conversation not found" });
    }

    await conversation.deleteOne();

    logger.info(
      `Conversation ${conversationId} deleted successfully by user ${req.userId}`
    );

    getIO().to(conversationId).emit("conversation:delete", { conversationId });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    logger.error(
      `Error deleting conversation ${req.params.conversationId} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};
