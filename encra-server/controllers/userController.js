const User = require("../models/User");
const logger = require("../utils/logger");

exports.getPublicKey = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`Fetching public key for user ${userId}`);

    const user = await User.findById(userId).select("pqPublicKey");

    if (!user) {
      logger.warn(`User ${userId} not found while fetching public key`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`Public key fetched for user ${userId}`);

    res.status(200).json({ pqPublicKey: user.pqPublicKey });
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
      .select("username _id");

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
