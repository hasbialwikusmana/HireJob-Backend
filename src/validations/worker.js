const { check } = require("express-validator");

const createWorker = [
  // name
  check("name").notEmpty().withMessage("Name cannot be empty"),

  // email
  check("email").notEmpty().withMessage("Email cannot be empty"),
  check("email", "Email must be gmail.com").custom((value) => {
    if (!value.endsWith("@gmail.com")) {
      throw new Error("Email must be gmail.com");
    }
    return true;
  }),

  // nohp
  check("nohp").notEmpty().withMessage("Nohp cannot be empty"),
  check("nohp", "Nohp must be number").custom((value) => {
    if (isNaN(value)) {
      throw new Error("Nohp must be number");
    }
    return true;
  }),

  // password
  check("password").notEmpty().withMessage("Password cannot be empty"),
  check("password", "Password must be at least 8 characters").isLength({ min: 8 }),

  //role
  check("role").notEmpty().withMessage("Role cannot be empty"),
  check("role", "Role must be workers").custom((value) => {
    if (value !== "workers") {
      throw new Error("Role must be workers");
    }
    return true;
  }),
];

const updateWorker = [
  // name
  check("name").notEmpty().withMessage("Name cannot be empty"),

  // nohp
  check("nohp").notEmpty().withMessage("Nohp cannot be empty"),

  // jobdesk
  check("jobdesk").notEmpty().withMessage("Jobdesk cannot be empty"),

  // residence
  check("residence").notEmpty().withMessage("Residence cannot be empty"),

  // workplace
  check("workplace").notEmpty().withMessage("Workplace cannot be empty"),

  // description
  check("description").notEmpty().withMessage("Description cannot be empty"),

  // job_type
  check("job_type").notEmpty().withMessage("Job type cannot be empty"),

  // instagram
  check("instagram").notEmpty().withMessage("Instagram cannot be empty"),

  // github
  check("github").notEmpty().withMessage("Github cannot be empty"),

  // gitlab
  check("gitlab").notEmpty().withMessage("Gitlab cannot be empty"),
];

const updateWorkerImage = [
  //image
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
];

module.exports = { updateWorker, createWorker, updateWorkerImage };
