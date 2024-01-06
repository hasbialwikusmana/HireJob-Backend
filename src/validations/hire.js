const { check } = require("express-validator");

const hireValidation = [
  check("reason").notEmpty().withMessage("Reason is required"),

  check("name").notEmpty().withMessage("Name is required"),

  check("email", "Email is required").notEmpty(),
  check("email", "Email must be gmail.com").custom((value) => {
    if (!value.endsWith("@gmail.com")) {
      throw new Error("Email must be gmail.com");
    }
    return true;
  }),

  check("nohp").notEmpty().withMessage("No HP is required"),

  check("description").notEmpty().withMessage("Description is required"),
];

module.exports = hireValidation;
