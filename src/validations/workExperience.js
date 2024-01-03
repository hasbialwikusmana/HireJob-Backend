const { check } = require("express-validator");

const createWorkExperienceValidation = [
  check("jobdesk").notEmpty().withMessage("Jobdesk cannot be empty"),

  check("company_name").notEmpty().withMessage("Company name cannot be empty"),

  check("date_start").notEmpty().withMessage("Date start cannot be empty"),

  check("date_end").notEmpty().withMessage("Date end cannot be empty"),

  check("description").notEmpty().withMessage("Description cannot be empty"),
];

const updateWorkExperienceValidation = [
  check("jobdesk").notEmpty().withMessage("Jobdesk cannot be empty"),

  check("company_name").notEmpty().withMessage("Company name cannot be empty"),

  check("date_start").notEmpty().withMessage("Date start cannot be empty"),

  check("date_end").notEmpty().withMessage("Date end cannot be empty"),

  check("description").notEmpty().withMessage("Description cannot be empty"),
];

module.exports = { createWorkExperienceValidation, updateWorkExperienceValidation };
