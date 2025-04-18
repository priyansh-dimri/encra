const express = require("express");
const keyController = require("../controllers/keyController");
const { verifyAccessToken } = require("../utils/authUtils");
const attachConversation = require("../middlewares/attachConversation");
const checkUserInConversation = require("../middlewares/checkUserInConversation");

const router = express.Router();

router.get(
  "/:conversationId",
  verifyAccessToken,
  attachConversation("params"),
  checkUserInConversation,
  keyController.fetchAndDeleteKey
);

module.exports = router;
