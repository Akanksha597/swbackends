const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PdfFile", pdfSchema);
