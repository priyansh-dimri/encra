const express = require("express");
const conversationController = require("../controllers/conversationController");
const { verifyAccessToken } = require("../utils/authUtils"); // Ensure only authenticated users can access these

const router = express.Router();

// Get all conversations for current user
router.get("/", verifyAccessToken, conversationController.getConversations);

// Start conversation
router.post("/start", verifyAccessToken, conversationController.startConversation);

module.exports = router;
