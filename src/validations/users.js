const { check } = require("express-validator");
const usersModel = require("../models/users");

const validateEmail = async (email) => {
  const { rowCount } = await usersModel.findEmail(email);

  if (rowCount > 0) {
    throw new Error("Email already exists");
  }
  return true;
};

const validateEmailLogin = async (email) => {
  const { rowCount } = await usersModel.findEmail(email);

  if (rowCount < 1) {
    throw new Error("Email not found");
  }
  return true;
};

const registerValidation = [
  check("name").notEmpty().withMessage("Name is required"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(validateEmail)
    .withMessage("Email already exists")
    .custom((value) => {
      if (!value.match(/^[a-zA-Z0-9._-]+@gmail\.com$/)) {
        throw new Error("Email must be gmail.com");
      }
      return true;
    }),

  check("nohp").notEmpty().withMessage("No HP is required"),
  check("password").notEmpty().withMessage("Password is required"),
  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .custom((value) => {
      if (value !== "workers" && value !== "recruiters") {
        throw new Error("Role must be workers or recruiters");
      }
      return true;
    }),
];

const loginValidation = [check("email").notEmpty().withMessage("Email is required").custom(validateEmailLogin), check("password").notEmpty().withMessage("Password is required")];

module.exports = {
  registerValidation,
  loginValidation,
};
