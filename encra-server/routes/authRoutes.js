const express = require("express");
const authController = require("../controllers/authController");
const { authLimiter } = require("../middlewares/rateLimiter");
const { validateRegister } = require("../middlewares/authMiddleware");
const csrfProtection = require("../middlewares/csrfProtection");

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  authLimiter,
  authController.register
);
router.post("/login", authLimiter, authController.login);
router.post("/logout", csrfProtection, authController.logout);
router.post(
  "/refresh",
  csrfProtection,
  authLimiter,
  authController.refreshToken
);
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;
