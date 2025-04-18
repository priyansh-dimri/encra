const express = require("express");
const conversationController = require("../controllers/conversationController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");
const csrfProtection = require("../middlewares/csrfProtection");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

// Get all conversations for current user
router.get("/", verifyAccessToken, conversationController.getConversations);

// Start conversation
router.post(
  "/start",
  verifyAccessToken,
  csrfProtection,
  authLimiter,
  conversationController.startConversation
);

router.delete(
  "/:conversationId",
  verifyAccessToken,
  csrfProtection,
  authLimiter,
  attachConversation("params"),
  checkUserInConversation,
  conversationController.deleteConversation
);

module.exports = router;
