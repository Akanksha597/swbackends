const DownloadLead = require("../models/DownloadLead");
const PdfFile = require("../models/PdfFile");
const sendWhatsAppPdf = require("../utils/sendWhatsAppPdf");

exports.downloadPdf = async (req, res) => {
  try {
    const { pdfId, mobileNumber, actionType } = req.body;

    if (!pdfId || !mobileNumber || !actionType) {
      return res.status(400).json({
        success: false,
        message: "pdfId, mobileNumber and actionType are required",
      });
    }

    const pdf = await PdfFile.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Save download/whatsapp action
    await DownloadLead.create({
      mobileNumber,
      pdfId,
      action: actionType, // "download" or "whatsapp"
      ipAddress: req.ip,
    });

    // ⚡ Use Cloudinary URL directly
    const pdfUrl = pdf.filePath;

    // Only generate WhatsApp link if action is whatsapp
    const whatsappUrl =
      actionType === "whatsapp"
        ? sendWhatsAppPdf({ mobileNumber, pdfUrl })
        : null;

    res.json({
      success: true,
      pdfUrl,
      whatsappUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllDownloadLeads = async (req, res) => {
  try {
    const leads = await DownloadLead.find()
      .populate("pdfId", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
