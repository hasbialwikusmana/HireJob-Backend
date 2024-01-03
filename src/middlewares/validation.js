const { validationResult } = require("express-validator");

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => {
      return {
        field: error.param,
        message: error.msg,
      };
    });

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errorDetails,
    });
  }

  next();
};

module.exports = validation;
