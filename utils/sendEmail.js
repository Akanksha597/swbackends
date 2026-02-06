const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server error:", error);
  } else {
    console.log("✅ Mail server ready");
  }
});

const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
