const { check } = require("express-validator");

const updateRecruiterValidation = [
  check("company_name", "Company name is required").notEmpty(),

  check("company_field", "Company field is required").notEmpty(),

  check("residence", "Residence is required").notEmpty(),

  check("description", "Description is required").notEmpty(),

  check("email", "Email is required").notEmpty(),
  check("email", "Email must be gmail.com").custom((value) => {
    if (!value.endsWith("@gmail.com")) {
      throw new Error("Email must be gmail.com");
    }
    return true;
  }),

  check("nohp", "No HP is required").notEmpty(),

  check("instagram", "Instagram is required").notEmpty(),

  check("linkedin", "Linkedin is required").notEmpty(),
];

const updateImageValidation = [
  check("image").custom((value, { req }) => {
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
];

const updateBannerValidation = [
  check("banner_image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Banner image is required");
    }

    const allowedExtensions = ["jpg", "jpeg", "png"]; // Sesuaikan dengan ekstensi gambar yang diizinkan
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Only JPG, JPEG, PNG, and GIF files are allowed");
    }

    if (req.file.size > maxFileSize) {
      throw new Error("Banner image size must be less than 2MB");
    }

    return true;
  }),
];

module.exports = { updateRecruiterValidation, updateImageValidation, updateBannerValidation };
