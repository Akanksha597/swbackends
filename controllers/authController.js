const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail"); // Make sure this function sends emails

/* ================= REGISTER ================= */
/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // ✅ SEND REGISTER EMAIL
    await sendEmail({
      to: email,
      subject: "Welcome to Auth App 🎉",
      text: `Hi ${name},

Your account has been successfully created.

You can now log in using your registered email.

Thank you for joining us!
`,
    });

    res.status(201).json({
      message: "Registration successful. Email sent.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    // ✅ NO OTP IN RESPONSE
    res.status(200).json({
      message: "OTP sent to your registered email",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
