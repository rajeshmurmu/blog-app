import multer from "multer";
import { MAX_FILE_SIZE } from "../config/conf.js";
import { validateImage } from "../utils/helper.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images"); // keep file in local
  },

  filename: async function (req, file, cb) {
    cb(null, "post-" + crypto.randomUUID().slice(0, 8) + file.originalname);
  },
});

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // 2 MB
  },
  fileFilter: function (req, file, cb) {
    // validate the image
    const is_valid_image = validateImage(file.size, file.mimetype);
    if (is_valid_image === null) {
      return cb(null, true);
    }

    // return error message if image is not valid
    return cb(new Error(is_valid_image), false);
  },
});
