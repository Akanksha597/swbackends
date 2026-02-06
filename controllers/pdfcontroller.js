const PdfFile = require("../models/PdfFile");

// UPLOAD PDF
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF file is required" });
    }

    const { title } = req.body;

    const pdf = await PdfFile.create({
      title: title || req.file.originalname,
      filePath: req.file.path, // Cloudinary URL
    });

    res.status(201).json({ success: true, data: pdf });
  } catch (err) {
    console.error("Upload PDF Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
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

    if (req.file) updateData.filePath = req.file.path;

    await PdfFile.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "PDF updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE PDF
exports.deletePdf = async (req, res) => {
  try {
    const { id } = req.params;
    await PdfFile.findByIdAndDelete(id);
    res.json({ success: true, message: "PDF deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
