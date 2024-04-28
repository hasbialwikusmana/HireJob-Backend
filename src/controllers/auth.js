const createError = require("http-errors");
const users = require("../models/users");
const authHelper = require("../helpers/auth");
const bcrypt = require("bcryptjs");
const commonHelper = require("../helpers/common");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const {
      rows: [user],
    } = await users.findByEmail(email);
    if (!user) {
      return commonHelper.response(res, null, 404, "Email or Password wrong");
    }

    const schema = Joi.object({
      email: Joi.string().empty("").required(),
      password: Joi.string().empty("").required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      // eslint-disable-next-line no-useless-escape
      return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return commonHelper.response(res, null, 401, "Email or Password wrong");
    }

    delete user.password;

    const payload = {
      id: user.user_id,
      email: user.email,
      role: user.role,
    };

    user.token = authHelper.generateToken(payload);
    user.refreshToken = authHelper.generateRefreshToken(payload);

    commonHelper.response(res, user, 200, "Login success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError(error));
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
  let payload = {
    id: decoded.user_id,
    email: decoded.email,
    role: decoded.role,
  };

  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.generateRefreshToken(payload),
  };
  commonHelper.response(res, result, 200);
};

module.exports = {
  login,
  refreshToken,
};
