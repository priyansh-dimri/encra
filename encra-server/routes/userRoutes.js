const express = require("express");
const userController = require("../controllers/userController");
const { verifyAccessToken } = require("../utils/authUtils");
const csrfProtection = require("../middlewares/csrfProtection");
const { authLimiter, fetchLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.get(
  "/public-key/:userId",
  verifyAccessToken,
  fetchLimiter,
  userController.getPublicKey
);

router.get(
  "/search",
  verifyAccessToken,
  fetchLimiter,
  userController.searchUserByUsername
);

router.delete(
  "/",
  verifyAccessToken,
  csrfProtection,
  authLimiter,
  userController.deleteAccount
);

module.exports = router;
