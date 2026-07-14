const multer = require('multer');
const path = require("path");

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".pdf", ".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
      return cb(new Error("❌ File type is not supported"), false);
    }
    cb(null, true);
  },
});
