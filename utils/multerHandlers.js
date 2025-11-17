const multer = require("multer");
// const path = require("path");
const cleanFileName = require("./formatFileUploadName.js")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = new Date().toISOString().replace(/:/g, "-") + cleanFileName(file.originalname);
    cb(null, uniqueName);
  }
})

const upload = multer({ storage: storage })
module.exports = upload;