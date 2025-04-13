const express = require("express");
const authController = require("../controllers/authController");
const { checkAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", checkAuth, authController.logout);
router.post("/refresh", authController.refreshToken);

module.exports = router;
