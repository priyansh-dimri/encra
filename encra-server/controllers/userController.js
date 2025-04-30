const User = require("../models/User");
const logger = require("../utils/logger");
const argon2 = require("argon2");

exports.getPublicKey = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`Fetching public key for user ${userId}`);

    const user = await User.findById(userId).select(
      "kyberPublicKey dilithiumPublicKey kyberPublicKeySignature"
    );

    if (!user) {
      logger.warn(`User ${userId} not found while fetching public key`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`Public key fetched for user ${userId}`);

    res.status(200).json(user);
  } catch (error) {
    logger.error(
      `Error fetching public key for user ${req.params.userId} - ${error}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username query is required" });
    }

    logger.info(`Searching for exact match: "${username}"`);

    const user = await User.findOne({ username })
      .collation({ locale: "en", strength: 2 }) // case-insensitive exact match
      .select("username name _id");

    if (!user) {
      logger.info(`No user found with username: "${username}"`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User found with username: "${username}"`);

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error searching user by username - ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required for account deletion" });
    }

    logger.info(`User ${userId} is attempting to delete their account`);

    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found during deletion`);
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(userId);

    logger.info(`User ${userId} has been deleted`);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "test",
      sameSite: "none",
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting account for user ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};
