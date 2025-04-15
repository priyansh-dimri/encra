const jwt = require("jsonwebtoken");

exports.generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "20m",
  });
};

exports.verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.userId = payload.userId;
    next();
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
  });
};

exports.verifyRefreshToken = (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return payload.userId;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
