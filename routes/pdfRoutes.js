const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  uploadPdf,
  getAllPdfs,
  viewPdf,
  downloadPdf
} = require("../controllers/pdfcontroller");

// Upload
router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);

// Get all
router.get("/pdfs", getAllPdfs);

// View
router.get("/view/:id", viewPdf);

// Download
router.get("/download/:id", downloadPdf);

module.exports = router;
