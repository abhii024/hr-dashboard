// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/resumes"; // default

    if (req.uploadType === "leave") {
      folder = "uploads/leaves";
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const prefix = req.uploadType === "leave" ? "leave" : "resume";
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type;
  next();
};

export default upload;
