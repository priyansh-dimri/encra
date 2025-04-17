const express = require("express");
const messageController = require("../controllers/messageController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");

const router = express.Router();

router.get(
  "/:conversationId",
  verifyAccessToken,
  attachConversation("params"),
  checkUserInConversation,
  messageController.getMessages
);

router.delete(
  "/:messageId",
  verifyAccessToken,
  attachConversation("body"),
  checkUserInConversation,
  messageController.deleteMessage
);

module.exports = router;
