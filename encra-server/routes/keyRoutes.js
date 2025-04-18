const express = require("express");
const keyController = require("../controllers/keyController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");
const csrfProtection = require("../middlewares/csrfProtection");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.delete(
  "/:conversationId",
  verifyAccessToken,
  csrfProtection,
  authLimiter,
  attachConversation("params"),
  checkUserInConversation,
  keyController.fetchAndDeleteKey
);

module.exports = router;
