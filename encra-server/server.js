const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/authRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

// Health Checking route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

module.exports = app;
