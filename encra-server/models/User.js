const mongoose = require("mongoose");

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
    pqPublicKey: {
      // Post Quantum Public Key
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

module.exports = mongoose.model("User", userSchema);
