const express = require("express");
const messageController = require("../controllers/messageController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");

const router = express.Router();

// TODO: add validation middlewares

router.get(
  "/:conversationId",
  verifyAccessToken,
  attachConversation("params"),
  checkUserInConversation,
  messageController.getMessages
);

router.post(
  "/send",
  verifyAccessToken,
  attachConversation("body"),
  checkUserInConversation,
  messageController.sendMessage
);

module.exports = router;
