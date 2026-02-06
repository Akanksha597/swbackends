// controllers/pdfController.js
const { v2: cloudinary } = require("cloudinary");
const PdfFile = require("../models/PdfFile");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Upload buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "pdfs", resource_type: "raw" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        // Save to DB
        const pdf = await PdfFile.create({ title: req.body.title, filePath: result.secure_url });
        return res.status(201).json({ success: true, data: pdf });
      }
    );

    // Convert buffer to stream
    const stream = require("stream");
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(result);

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: err.message });
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
