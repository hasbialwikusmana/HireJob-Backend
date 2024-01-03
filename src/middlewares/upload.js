const multer = require("multer");

// manajemen file
const multerUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    const maxSize = 2 * 1024 * 1024;
    if (fileSize > maxSize) {
      const error = {
        message: "File size too large (max 2MB)",
      };
      return cb(error, false);
    }
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      const error = {
        message: "file must be jpeg,jpg or png",
      };
      cb(error, false);
    }
  },
});

// middleware
const upload = (req, res, next) => {
  const multerSingle = multerUpload.single("image");
  multerSingle(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        status: "error",
        message: "Bad request",
        errors: [{ field: "image", message: err.message }],
      });
    }
    next();
  });
};

const uploadBanner = (req, res, next) => {
  const multerSingle = multerUpload.single("banner_image");
  multerSingle(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
        message: "Bad request",
        errors: [{ field: "banner_image", message: err.message }],
      });
    } else {
      next();
    }
  });
};

module.exports = { upload, uploadBanner };
