const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  uploadPdf,
  getAllPdfs,
  viewPdf,
  downloadPdf
} = require("../controllers/pdfcontroller"); // ✅ correct casing

router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);
router.get("/pdfs", getAllPdfs);
router.get("/view/:id", viewPdf);
router.get("/download/:id", downloadPdf);

module.exports = router;
