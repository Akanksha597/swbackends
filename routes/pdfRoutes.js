const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Multer + Cloudinary
const { uploadPdf, getAllPdfs } = require("../controllers/pdfcontroller");

// Upload PDF
router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);


// Get all PDFs
router.get("/pdfs", getAllPdfs);

module.exports = router;
