const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/auth", authRouter);

// Health Checking route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

module.exports = app;
