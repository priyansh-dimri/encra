const logger = require("../utils/logger");
const { removeOnlineUser } = require("./socket/onlineUsers");

module.exports = (socket) => {
  socket.on("disconnect", (reason) => {
    removeOnlineUser(socket.userId, socket.id);
    logger.info(`Socket disconnected: ${socket.id} (${reason})`);
  });
};
