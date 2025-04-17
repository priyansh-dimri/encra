const express = require("express");
const conversationController = require("../controllers/conversationController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");

const router = express.Router();

// Get all conversations for current user
router.get("/", verifyAccessToken, conversationController.getConversations);

// Start conversation
router.post("/start", verifyAccessToken, conversationController.startConversation);

router.delete(
  "/:conversationId",
  verifyAccessToken,
  attachConversation("params"),
  checkUserInConversation,
  conversationController.deleteConversation
);

module.exports = router;
