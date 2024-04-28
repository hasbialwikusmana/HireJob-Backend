const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const users = require("../models/users");
const hire = require("../models/hire");
const commonHelper = require("../helpers/common");
const Joi = require("joi");

const create = async (req, res, next) => {
  try {
    const { message_purpose, worker_id, name, email, phone, description } = req.body;
    const emailRecruiter = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(emailRecruiter, { relation: "recruiters" });

    const schema = Joi.object({
      message_purpose: Joi.string().empty("").required(),
      worker_id: Joi.string().empty("").required(),
      name: Joi.string().empty("").required(),
      email: Joi.string().empty("").required(),
      phone: Joi.string().empty("").required(),
      description: Joi.string().empty("").required(),
    });

    const { error } = schema.validate({
      message_purpose,
      worker_id,
      name,
      email,
      phone,
      description,
    });

    if (error) {
      // eslint-disable-next-line no-useless-escape
      return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }

    const data = {
      id: uuidv4(),
      message_purpose,
      recruiter_id: user.id,
      worker_id,
      name,
      email,
      phone,
      description,
    };
    await hire.create(data);
    commonHelper.response(res, data, 201, "create hire success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};
const selectByWorker = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });
    const { rows } = await hire.selectAll({ filterBy: "worker_id", filterValue: user.id });
    commonHelper.response(res, rows, 200, "get hire with workers success");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const selectByRecruiters = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "recruiters" });
    const { rows } = await hire.selectAll({ filterBy: "recruiter_id", filterValue: user.id });
    commonHelper.response(res, rows, 200, "get hire with workers success");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  create,
  selectByWorker,
  selectByRecruiters,
};
