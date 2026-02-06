const cloudinary = require("../config/cloudinary");
const PdfFile = require("../models/PdfFile");
const fs = require("fs");

/* ============ UPLOAD PDF ============ */
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload as RAW (VERY IMPORTANT)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "pdfs",
      resource_type: "raw"
    });

    // remove local file
    fs.unlinkSync(req.file.path);

    const pdf = await PdfFile.create({
      title: req.body.title,
      filePath: result.secure_url,
      public_id: result.public_id
    });

    res.status(201).json({
      success: true,
      data: pdf
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ GET ALL PDFs ============ */
exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await PdfFile.find().sort({ createdAt: -1 });
    res.json({ success: true, data: pdfs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ VIEW PDF ============ */
exports.viewPdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Redirect to Cloudinary RAW URL
    res.redirect(pdf.filePath);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ DOWNLOAD PDF ============ */
exports.downloadPdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.redirect(pdf.filePath + "?dl=1");

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ UPDATE PDF ============ */
exports.updatePdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    if (req.body.title) {
      pdf.title = req.body.title;
    }

    if (req.file) {
      // delete old pdf
      await cloudinary.uploader.destroy(pdf.public_id, {
        resource_type: "raw"
      });

      // upload new pdf
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "pdfs",
        resource_type: "raw"
      });

      fs.unlinkSync(req.file.path);

      pdf.filePath = result.secure_url;
      pdf.public_id = result.public_id;
    }

    await pdf.save();

    res.json({
      success: true,
      message: "PDF updated successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ DELETE PDF ============ */
exports.deletePdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    await cloudinary.uploader.destroy(pdf.public_id, {
      resource_type: "raw"
    });

    await pdf.deleteOne();

    res.json({
      success: true,
      message: "PDF deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
