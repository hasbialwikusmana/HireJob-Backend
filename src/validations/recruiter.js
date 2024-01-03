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

module.exports = updateRecruiterValidation;
