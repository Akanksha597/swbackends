const DownloadLead = require("../models/DownloadLead");
const PdfFile = require("../models/PdfFile");
const sendWhatsAppPdf = require("../utils/sendWhatsAppPdf");

exports.downloadPdf = async (req, res) => {
  try {
    const { pdfId, mobileNumber } = req.body;

    if (!pdfId || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "pdfId and mobileNumber are required",
      });
    }

    const pdf = await PdfFile.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    await DownloadLead.create({
      mobileNumber,
      pdfId,
      action: "whatsapp",
      ipAddress: req.ip,
    });

const pdfUrl = `${process.env.BASE_URL}/${pdf.filePath.replace(/\\/g, "/")}`;

const whatsappUrl = sendWhatsAppPdf({
  mobileNumber,
  pdfUrl,
});

res.json({
  success: true,
  pdfUrl,      // ✅ Add this
  whatsappUrl, // ✅ Already exists
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
      .populate("pdfId", "title") // show pdf title
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
