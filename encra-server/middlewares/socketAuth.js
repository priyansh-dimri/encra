const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    logger.warn(`Socket ${socket.id} missing auth token`);
    return next(new Error("Auth token required"));
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!userId || typeof userId !== "string") {
      return next(new Error("Invalid token structure"));
    }

    socket.userId = userId;
    next();
  } catch (err) {
    logger.warn(`Socket ${socket.id} auth failed: ${err.message}`);
    next(new Error("Authentication error"));
  }
};
