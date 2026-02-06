const express = require("express");
const router = express.Router();
const { downloadPdf , getAllDownloadLeads } = require("../controllers/downloadController");

router.post("/download-pdf", downloadPdf);

router.get("/admin/download-leads", getAllDownloadLeads);

module.exports = router;
