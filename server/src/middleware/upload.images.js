import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const repairNumber = req.repairNumber;
    const uploadPath = path.join("src", "uploads", "repairs", repairNumber);

    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `customer-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
});

export default upload;
