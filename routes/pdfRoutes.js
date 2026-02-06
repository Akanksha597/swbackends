const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadPdf, getAllPdfs , updatePdf ,  deletePdf } = require("../controllers/pdfcontroller");

router.post("/admin/upload-pdf", upload.single("pdf"), uploadPdf);
router.get("/pdfs", getAllPdfs);
router.put("/admin/update-pdf/:id", upload.single("pdf"), updatePdf);
router.delete("/admin/delete-pdf/:id", deletePdf);


module.exports = router;
