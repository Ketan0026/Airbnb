const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings",
    allowed_formats: ["jpeg", "png", "jpg", "avif", "webp", "gif", "svg", "heic"],
  },
});

const upload = multer({ storage });

module.exports = upload;
