const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const commonHelper = require("../helpers/common");
const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.payload = decoded;
      next();
    } else {
      res.status(401).json({
        message: "server need token",
      });
    }
  } catch (error) {
    console.log(error);
    if (error && error.name === "JsonWebTokenError") {
      next(new createError(400, "Token invalid"));
    } else if (error && error.name === "TokenExpiredError") {
      next(new createError(400, "Token expired"));
    } else {
      next(new createError(400, "Token not active"));
    }
  }
};

const isIdValid = (req, res, next) => {
  const payload = req.payload;
  const queryId = req.params.id_recruiter || req.params.id_worker;

  if (payload) {
    if (payload.id == queryId) {
      next();
    } else {
      commonHelper.response(res, null, 403, "Modifying data created by other user is not allowed");
    }
  } else {
    commonHelper.response(res, null, 403, "User not found");
  }
};

const isRecruiter = (req, res, next) => {
  const payload = req.payload;
  if (payload) {
    if (payload.role === "recruiters") {
      next();
    } else {
      commonHelper.response(res, null, 403, "Do not have access, please login as recruiter");
    }
  } else {
    commonHelper.response(res, null, 403, "User not found");
  }
};

const isWorker = (req, res, next) => {
  const payload = req.payload;
  if (payload) {
    if (payload.role === "workers") {
      next();
    } else {
      commonHelper.response(res, null, 403, "Do not have access, please login as worker");
    }
  } else {
    commonHelper.response(res, null, 403, "User not found");
  }
};

module.exports = { protect, isIdValid, isRecruiter, isWorker };
