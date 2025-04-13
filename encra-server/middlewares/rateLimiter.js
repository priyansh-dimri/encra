const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 100,
  message: 'Too many requests from this IP. Please try again 20 minutes later.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = authLimiter;
