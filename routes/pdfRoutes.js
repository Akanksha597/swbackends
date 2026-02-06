const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadPdf, getAllPdfs } = require("../controllers/pdfcontroller");
const PdfFile = require("../models/PdfFile");

// Upload PDF
router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);

// Get all PDFs
router.get("/pdfs", getAllPdfs);

// Download PDF by ID with proper filename
router.get("/download/:id", async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    // Force download with proper filename
    const downloadUrl = pdf.filePath.replace(
      "/upload/",
      `/upload/fl_attachment:${encodeURIComponent(pdf.title)}.pdf/`
    );

    return res.redirect(downloadUrl);

  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ success: false, message: "Download failed" });
  }
});


module.exports = router;
