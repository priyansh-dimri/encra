const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/authUtils");

exports.register = async (req, res) => {
  const { username, email, password, pqPublicKey, name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.info(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = process.env.BCRYPT_SALT_ROUNDS
      ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
      : 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      pqPublicKey,
      name: name || "",
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    const newRefreshToken = new RefreshToken({
      userId: newUser._id,
      token: refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await newRefreshToken.save();

    logger.info("User registered successfully.");
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ accessToken });
  } catch (error) {
    logger.error(`Registration error: ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const existingRefreshToken = await RefreshToken.findOne({
      userId: user._id,
    });
    if (existingRefreshToken) {
      existingRefreshToken.token = refreshToken;
      existingRefreshToken.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      await existingRefreshToken.save();
    } else {
      const newRefreshToken = new RefreshToken({
        userId: user._id,
        token: refreshToken,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      await newRefreshToken.save();
    }

    logger.info("User logged in successfully.");
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken });
  } catch (error) {
    logger.error(`Login error: ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({ message: "No Refresh Token provided." });

  try {
    await RefreshToken.deleteOne({ token: refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    logger.info("User logged out successfully.");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Logout error: ${error}`);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  const oldToken = req.cookies.refreshToken;

  if (!oldToken)
    return res.status(401).json({ message: "No Refresh token provided" });

  try {
    const userId = verifyRefreshToken(oldToken);

    const token = await RefreshToken.findOne({ token: oldToken });
    if (!token || token.expiresAt < Date.now()) {
      return res
        .status(403)
        .json({ message: "Invalid or Expired Refresh token." });
    }

    await RefreshToken.deleteOne({ token: oldToken });

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    const newRefreshDoc = new RefreshToken({
      userId,
      token: newRefreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    await newRefreshDoc.save();

    logger.info("Refresh token rotated and access token issued.");

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error(`Token refresh error: ${error}`);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
