// const jwt = require("jsonwebtoken");

// exports.protect = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // contains userId
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ FULL USER
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
