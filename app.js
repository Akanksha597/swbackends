const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();


let isConnected = false;

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("MongoDB connected");
    } catch (err) {
      console.error("DB Connection Error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});


// 🔥 Connect DB immediately
// connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/downloadRoutes"));
app.use("/api", require("./routes/pdfRoutes"));

// const PORT = process.env.PORT || 5016;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
module.exports = app ;