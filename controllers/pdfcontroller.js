const PdfFile = require("../models/PdfFile");

// UPLOAD PDF
exports.uploadPdf = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF required" });
    }

    const pdf = await PdfFile.create({
      title,
      fileName: req.file.filename,
      filePath: req.file.path, // local path
    });

    res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      data: pdf,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PDFs
exports.getAllPdfs = async (req, res) => {
  const pdfs = await PdfFile.find().sort({ createdAt: -1 });
  res.json({ success: true, data: pdfs });
};

// UPDATE PDF
exports.updatePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { title: req.body.title };

    if (req.file) {
      updateData.fileName = req.file.filename;
      updateData.filePath = req.file.path;
    }

    await PdfFile.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "PDF updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PDF
exports.deletePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = await PdfFile.findByIdAndDelete(id);

    // Remove file from disk
    if (pdf && pdf.filePath) {
      const fs = require("fs");
      fs.unlink(pdf.filePath, (err) => {
        if (err) console.error("Failed to delete PDF file:", err);
      });
    }

    res.json({ success: true, message: "PDF deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
