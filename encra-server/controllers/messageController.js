const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const conversationId = req.conversation._id;
    const query = { chat: conversationId };
    const limit = parseInt(req.query.limit, 10) || 20;
    const before = req.query.before;

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const conversationId = req.conversation._id;
    const { content, messageType } = req.body;

    const newMessage = await Message.create({
      chat: conversationId,
      sender: req.userId,
      content,
      messageType,
    });
    // TODO: add image support
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
