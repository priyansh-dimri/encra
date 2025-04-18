const onlineUsers = new Map(); // userId is mapped to a Set of socketIds for multi-tab support

function addOnlineUser(userId, socketId) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
}

function removeOnlineUser(userId, socketId) {
  if (onlineUsers.has(userId)) {
    onlineUsers.get(userId).delete(socketId);
    if (onlineUsers.get(userId).size === 0) {
      onlineUsers.delete(userId);
    }
  }
}

function getUserSockets(userId) {
  return onlineUsers.get(userId) || new Set();
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getUserSockets,
};
