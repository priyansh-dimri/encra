const { RateLimiterMemory } = require('rate-limiter-flexible');
const logger = require('../utils/logger');

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 events
  duration: 5, // 5 seconds
});

module.exports = (socket, next) => {
  const identifier = socket.handshake.address || socket.userId || socket.id;

  rateLimiter.consume(identifier)
    .then(() => {
      next();
    })
    .catch(() => {
      logger.warn(`Rate limit exceeded for socket ${socket.id} (${identifier})`);
      socket.emit('rate:limit', 'Too many requests!');
    });
};
