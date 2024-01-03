const { check } = require("express-validator");

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

module.exports = updateWorker;
