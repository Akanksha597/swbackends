// routes/pdfRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadPdf, getAllPdfs } = require("../controllers/pdfcontroller");

router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);
router.get("/pdfs", getAllPdfs);

module.exports = router;
