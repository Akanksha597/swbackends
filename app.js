const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB ONCE (serverless-safe)
connectDB().catch(err => {
  console.error("MongoDB connection error:", err.message);
});

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/downloadRoutes"));
app.use("/api", require("./routes/pdfRoutes"));

module.exports = app;
