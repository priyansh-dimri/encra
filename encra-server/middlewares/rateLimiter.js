const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 100,
  message: "Too many requests from this IP. Please try again 20 minutes later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const fetchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: "Too many fetch requests. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  fetchLimiter,
};
