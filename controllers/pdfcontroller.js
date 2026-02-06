const cloudinary = require("../config/cloudinary");
const PdfFile = require("../models/PdfFile");
const streamifier = require("streamifier");
const axios = require("axios");

/* ================= UPLOAD PDF ================= */
// controllers/pdfController.js
const cloudinary = require("../config/cloudinary"); // import our config
const PdfFile = require("../models/PdfFile");
const streamifier = require("streamifier");

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "pdfs", resource_type: "raw" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer(req.file.buffer);

    const pdf = await PdfFile.create({ title: req.body.title, filePath: result.secure_url });

    res.status(201).json({ success: true, data: pdf });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "Cloudinary upload failed", error: err.message });
  }
};


/* ================= GET ALL PDFs ================= */
exports.getAllPdfs = async (req, res) => {
  const pdfs = await PdfFile.find().sort({ createdAt: -1 });
  res.json({ success: true, data: pdfs });
};

/* ================= VIEW PDF ================= */
exports.viewPdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    const response = await axios.get(pdf.filePath, {
      responseType: "stream"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    response.data.pipe(res);

  } catch (err) {
    console.error("View Error:", err);
    res.status(500).json({ message: "View failed" });
  }
};

/* ================= DOWNLOAD PDF ================= */
exports.downloadPdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    const response = await axios.get(pdf.filePath, {
      responseType: "stream"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdf.title}.pdf"`
    );

    response.data.pipe(res);

  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ message: "Download failed" });
  }
};