const express = require("express");
const conversationController = require("../controllers/conversationController");
const { verifyAccessToken } = require("../utils/authUtils");

const router = express.Router();

// Get all conversations for current user
router.get("/", verifyAccessToken, conversationController.getConversations);

// Start conversation
router.post("/start", verifyAccessToken, conversationController.startConversation);

module.exports = router;
