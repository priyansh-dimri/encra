const mongoose = require("mongoose");
const ChatRoom = require("./ChatRoom");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    kyberPublicKey: {
      type: String,
      required: true,
    },
    dilithiumPublicKey: {
      type: String,
      required: true,
    },
    kyberPublicKeySignature: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await ChatRoom.deleteMany({ participants: this._id });
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("User", userSchema);
