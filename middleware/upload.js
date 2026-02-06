// // middleware/upload.js
// const multer = require("multer");

// const storage = multer.memoryStorage(); // store file in memory
// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype !== "application/pdf") {
//       return cb(new Error("Only PDFs are allowed"));
//     }
//     cb(null, true);
//   },
// });

// module.exports = upload;


const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

