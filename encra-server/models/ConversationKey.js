const mongoose = require("mongoose");

const conversationKeySchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encryptedKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

conversationKeySchema.index({ recipientId: 1, conversationId: 1 });

module.exports = mongoose.model("ConversationKey", conversationKeySchema);
