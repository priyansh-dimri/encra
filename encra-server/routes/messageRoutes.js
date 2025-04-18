const express = require("express");
const messageController = require("../controllers/messageController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");
const csrfProtection = require("../middlewares/csrfProtection");
const { authLimiter, fetchLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.get(
  "/:conversationId",
  verifyAccessToken,
  fetchLimiter,
  attachConversation("params"),
  checkUserInConversation,
  messageController.getMessages
);

router.delete(
  "/:messageId",
  verifyAccessToken,
  csrfProtection,
  authLimiter,
  attachConversation("body"),
  checkUserInConversation,
  messageController.deleteMessage
);

module.exports = router;
