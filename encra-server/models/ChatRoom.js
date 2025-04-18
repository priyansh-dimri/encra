const mongoose = require("mongoose");
const Message = require("./Message");
const ConversationKey = require("./ConversationKey");

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

// This Sort the participants for ensuring proper ordering
chatRoomSchema.pre("save", function (next) {
  if (this.participants) {
    this.participants.sort();
  }
  next();
});

// Indexing the participants for quick lookups
chatRoomSchema.index({ participants: 1 });

// This will delete every messages when the conversation is deleted
chatRoomSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Message.deleteMany({ chat: this._id });
      await ConversationKey.deleteMany({ conversationId: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

chatRoomSchema.pre(
  "deleteMany",
  { document: false, query: true },
  async function (next) {
    try {
      const filter = this.getFilter();
      const rooms = await this.model.find(filter);

      const roomIds = rooms?.map((room) => room._id) || [];

      if (roomIds.length === 0) return next();

      await Message.deleteMany({ chat: { $in: roomIds } });
      await ConversationKey.deleteMany({ conversationId: { $in: roomIds } });

      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
