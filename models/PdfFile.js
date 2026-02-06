const mongoose = require("mongoose");

const pdfFileSchema = new mongoose.Schema(
  {
    title: String,
    filePath: String, // uploads/pdfs/test.pdf
  },
  { timestamps: true }
);

module.exports = mongoose.model("PdfFile", pdfFileSchema);
