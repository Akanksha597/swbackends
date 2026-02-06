const PdfFile = require("../models/PdfFile");

// UPLOAD PDF
exports.uploadPdf = async (req, res) => {
  try {
    console.log("Files received:", req.file || req.files);
    console.log("Request body:", req.body);

    // Cloudinary upload code
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "raw" });
    console.log("Cloudinary result:", result);

    // Save to DB
    const pdf = await PdfFile.create({ title: req.body.title, filePath: result.secure_url });
    res.status(201).json({ success: true, data: pdf });
  } catch (error) {
    console.error("Upload error:", error);
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
