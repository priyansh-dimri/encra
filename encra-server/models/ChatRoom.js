const mongoose = require("mongoose");

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

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
