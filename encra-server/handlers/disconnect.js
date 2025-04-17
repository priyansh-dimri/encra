const logger = require("../utils/logger");

module.exports = (socket) => {
  socket.on("disconnect", (reason) => {
    logger.info(`Socket disconnected: ${socket.id} (${reason})`);
  });
};
