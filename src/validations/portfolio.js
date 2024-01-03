const { check } = require("express-validator");

const createPortfolioValidation = [
  check("name", "Name is required").notEmpty(),

  check("portfolio_type")
    .notEmpty()
    .isLength({
      min: 3,
    })
    .withMessage("Portfolio type must be at least 3 characters"),

  check("image", "Image is required").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }

    const allowedExtensions = ["jpg", "jpeg", "png"]; // Sesuaikan dengan ekstensi gambar yang diizinkan
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Only JPG, JPEG, PNG, and GIF files are allowed");
    }

    if (req.file.size > maxFileSize) {
      throw new Error("Image size must be less than 2MB");
    }

    return true;
  }),

  check("repo_link", "Repo link is required").notEmpty().isURL().withMessage("Repo link must be URL"),
];

const updatePortfolioValidation = [
  check("name", "Name is required").notEmpty(),

  check("portfolio_type")
    .notEmpty()
    .isLength({
      min: 3,
    })
    .withMessage("Portfolio type must be at least 3 characters"),

  check("image", "Image is required").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }

    const allowedExtensions = ["jpg", "jpeg", "png"]; // Sesuaikan dengan ekstensi gambar yang diizinkan
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Only JPG, JPEG, PNG, and GIF files are allowed");
    }

    if (req.file.size > maxFileSize) {
      throw new Error("Image size must be less than 2MB");
    }

    return true;
  }),

  check("repo_link", "Repo link is required").notEmpty().isURL().withMessage("Repo link must be URL"),
];

module.exports = { createPortfolioValidation, updatePortfolioValidation };
