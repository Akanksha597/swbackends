const mongoose = require("mongoose");

const downloadLeadSchema = new mongoose.Schema(
  {
    mobileNumber: String,
    pdfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PdfFile",
    },
    action: String,
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DownloadLead", downloadLeadSchema);
