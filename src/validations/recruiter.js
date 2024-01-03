const { check } = require("express-validator");

const updateRecruiterValidation = [
  // name
  check("name").notEmpty().withMessage("Name cannot be empty"),

  // email
  check("email").notEmpty().withMessage("Email cannot be empty"),
  check("email").isEmail().withMessage("Email must be a valid email"),

  // company_name
  check("company_name").notEmpty().withMessage("Company name cannot be empty"),

  // jobdesk
  check("jobdesk").notEmpty().withMessage("Jobdesk cannot be empty"),

  // nohp
  check("nohp").notEmpty().withMessage("Nohp cannot be empty"),

  // company_field
  check("company_field").notEmpty().withMessage("Company field cannot be empty"),

  // workplace
  check("workplace").notEmpty().withMessage("Workplace cannot be empty"),

  // description
  check("description").notEmpty().withMessage("Description cannot be empty"),

  // instagram
  check("instagram").notEmpty().withMessage("Instagram cannot be empty"),

  // linkedin
  check("linkedin").notEmpty().withMessage("Linkedin cannot be empty"),
];

module.exports = updateRecruiterValidation;
