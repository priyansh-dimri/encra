module.exports = (req, res, next) => {
  const conversation = req.conversation;

  if (!conversation) {
    return res
      .status(500)
      .json({ message: "Conversation data missing from request." });
  }

  if (!conversation.participants.includes(req.userId)) {
    return res
      .status(403)
      .json({ message: "User not authorized for this conversation." });
  }

  next();
};
