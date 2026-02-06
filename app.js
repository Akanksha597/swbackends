const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // 👈 important

dotenv.config();

let isConnected = false;

const app = express();
app.use(cors());
app.use(express.json());

// Root route (fixes 404)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// DB connection
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/downloadRoutes"));
app.use("/api", require("./routes/pdfRoutes"));

module.exports = app;
