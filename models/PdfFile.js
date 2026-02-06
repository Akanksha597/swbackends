const mongoose = require("mongoose");

const pdfFileSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filePath: { type: String, required: true }, // Cloudinary URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("PdfFile", pdfFileSchema);
