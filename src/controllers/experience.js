const { v4: uuidv4 } = require("uuid");
const users = require("../models/users");
const experience = require("../models/experience");
const createError = require("http-errors");
const commonHelper = require("../helpers/common");
const Joi = require("joi");

const selectAll = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });
    const { rows } = await experience.selectAll({ worker_id: user.id });
    commonHelper.response(res, rows, 201, "penambahan skill success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};
const selectByWorker = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { rows } = await experience.selectAll({ worker_id: id });
    commonHelper.response(res, rows, 201, "penambahan skill success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const create = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const { position, company, work_month, work_year, description } = req.body;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });

    const schema = Joi.object({
      position: Joi.string().empty("").required(),
      company: Joi.string().empty("").required(),
      work_month: Joi.string().empty("").required(),
      work_year: Joi.string().empty("").required(),
      description: Joi.string().empty("").required(),
    });

    const { error } = schema.validate({
      position,
      company,
      work_month,
      work_year,
      description,
    });
    if (error) {
      // eslint-disable-next-line no-useless-escape
      return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }
    const data = {
      id: uuidv4(),
      worker_id: user.id,
      position,
      company,
      work_month,
      work_year,
      description,
    };
    await experience.create(data);
    delete data.worker_id;
    commonHelper.response(res, data, 201, "Experience added successfully");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const drop = async (req, res, next) => {
  try {
    const id = req.params.id;
    await experience.drop({ id });
    commonHelper.response(res, { id }, 201, "Delete experience success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
  const id = req.params.id;
  await experience.drop({ id });
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { position, company, work_month, work_year, description } = req.body;

    const schema = Joi.object({
      position: Joi.string().empty("").required(),
      company: Joi.string().empty("").required(),
      work_month: Joi.string().empty("").required(),
      work_year: Joi.string().empty("").required(),
      description: Joi.string().empty("").required(),
    });

    const { error } = schema.validate({
      position,
      company,
      work_month,
      work_year,
      description,
    });
    if (error) {
      // eslint-disable-next-line no-useless-escape
      return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }
    const data = {
      position,
      company,
      work_month,
      work_year,
      description,
      updated_at: new Date(),
    };
    await experience.update(data, id);
    commonHelper.response(res, { id: id, ...data }, 200, "Update experience success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

module.exports = {
  create,
  selectAll,
  drop,
  update,
  selectByWorker,
};
