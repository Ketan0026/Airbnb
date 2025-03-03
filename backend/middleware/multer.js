const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings",
    allowed_formats: ["jpeg", "png", "jpg", "avif"],
  },
});

const upload = multer({ storage });

module.exports = upload;
