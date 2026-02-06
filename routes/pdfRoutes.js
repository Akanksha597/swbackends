const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  uploadPdf,
  getAllPdfs,
  viewPdf,
  downloadPdf,
  updatePdf,
  deletePdf
} = require("../controllers/pdfcontroller");

router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);
router.get("/pdfs", getAllPdfs);
router.get("/view/:id", viewPdf);
router.get("/download/:id", downloadPdf);
router.put("/update/:id", upload.single("pdf"), updatePdf);
router.delete("/delete/:id", deletePdf);

module.exports = router;
