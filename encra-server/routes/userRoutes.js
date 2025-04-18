const express = require("express");
const userController = require("../controllers/userController");
const { verifyAccessToken } = require("../utils/authUtils");

const router = express.Router();

router.get(
  "/public-key/:userId",
  verifyAccessToken,
  userController.getPublicKey
);
router.get("/search", verifyAccessToken, userController.searchUserByUsername);
router.delete("/", verifyAccessToken, userController.deleteAccount);

module.exports = router;
