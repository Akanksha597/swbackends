const cloudinary = require("../config/cloudinary");
const PdfFile = require("../models/PdfFile");
const streamifier = require("streamifier");

/* ============ HELPER ============ */
const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pdfs",
        resource_type: "auto" // IMPORTANT for viewing PDFs
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/* ============ UPLOAD PDF ============ */
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadFromBuffer(req.file.buffer);

    const pdf = await PdfFile.create({
      title: req.body.title,
      filePath: result.secure_url,
      public_id: result.public_id
    });

    res.status(201).json({ success: true, data: pdf });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ GET ALL PDFs ============ */
exports.getAllPdfs = async (req, res) => {
  const pdfs = await PdfFile.find().sort({ createdAt: -1 });
  res.json({ success: true, data: pdfs });
};

/* ============ VIEW PDF ============ */
exports.viewPdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Cloudinary handles inline preview
    res.redirect(pdf.filePath);

  } catch {
    res.status(500).json({ message: "View failed" });
  }
};

/* ============ DOWNLOAD PDF ============ */
exports.downloadPdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.redirect(pdf.filePath + "?dl=1");

  } catch {
    res.status(500).json({ message: "Download failed" });
  }
};

/* ============ UPDATE PDF ============ */
exports.updatePdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    if (req.body.title) pdf.title = req.body.title;

    if (req.file) {
      await cloudinary.uploader.destroy(pdf.public_id, {
        resource_type: "auto"
      });

      const result = await uploadFromBuffer(req.file.buffer);
      pdf.filePath = result.secure_url;
      pdf.public_id = result.public_id;
    }

    await pdf.save();
    res.json({ success: true, message: "PDF updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============ DELETE PDF ============ */
exports.deletePdf = async (req, res) => {
  try {
    const pdf = await PdfFile.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    await cloudinary.uploader.destroy(pdf.public_id, {
      resource_type: "auto"
    });

    await pdf.deleteOne();
    res.json({ success: true, message: "PDF deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
