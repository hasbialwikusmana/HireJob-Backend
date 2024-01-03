const { check } = require("express-validator");

const createSkillValidation = [
  check("name", "Name is required").notEmpty(),
  check("name", "Name must be at least 3 characters").isLength({
    min: 3,
  }),
];

module.exports = createSkillValidation;
