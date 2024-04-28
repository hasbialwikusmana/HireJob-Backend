const { v4: uuidv4 } = require("uuid");
const users = require("../models/users");
const skills = require("../models/skill");
const commonHelper = require("../helpers/common");
const createError = require("http-errors");
const Joi = require("joi");
const create = async (req, res, next) => {
  try {
    const { skill_name } = req.body;
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });

    // Memeriksa apakah skill sudah ada untuk worker yang sama
    const existingSkill = await skills.findSkillByWorkerAndName(user.id, skill_name);

    if (existingSkill) {
      // Jika skill sudah ada, kembalikan respons dengan pesan error
      return commonHelper.response(res, null, 400, "Skill already exists");
    }

    const schema = Joi.object({
      skill_name: Joi.string().required(),
    });

    const { error } = schema.validate({ skill_name });
    if (error) {
      // eslint-disable-next-line no-useless-escape
      return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }

    const data = {
      id: uuidv4(),
      worker_id: user.id,
      skill_name,
    };
    await skills.create(data);
    commonHelper.response(res, { skill_name }, 201, "Skill created successfully");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const drop = async (req, res, next) => {
  try {
    const id = req.params.id;
    await skills.drop(id);
    commonHelper.response(res, { id }, 200, "delete skill success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const selectAll = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });
    const { rows } = await skills.selectAll({ id: user.id });
    commonHelper.response(res, rows, 200, "Get skill success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};
const selectByWorker = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { rows } = await skills.selectAll({ id: id });
    commonHelper.response(res, rows, 200, "Get skill success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};
module.exports = {
  create,
  drop,
  selectAll,
  selectByWorker,
};
