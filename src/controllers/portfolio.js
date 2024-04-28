const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");
const users = require("../models/users");
const portfolio = require("../models/portfolio");
const { response } = require("../helpers/common");
const cloudinary = require("../utils/cloudinary");
const Joi = require("joi");

const create = async (req, res, next) => {
  try {
    const { application_name, link_repo, portfolio_type } = req.body;
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });

    // const schema = Joi.object({
    //   application_name: Joi.string().empty("").required(),
    //   link_repo: Joi.string().empty("").required(),
    //   portfolio_type: Joi.string().empty("").required(),
    // });

    // const { error } = schema.validate({ application_name, link_repo, portfolio_type });
    // if (error) {
    //   // eslint-disable-next-line no-useless-escape
    //   return response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    // }

    let photo = req.file;
    const result = await cloudinary.uploader.upload(photo.path);
    const image = result.secure_url;

    const data = {
      id: uuidv4(),
      worker_id: user.id,
      application_name,
      link_repo,
      portfolio_type,
      image: image,
    };

    if (user.image !== null && user.image !== undefined) {
      const public_id = user.image.split("/").pop().split(".").shift();
      await cloudinary.uploader.destroy(public_id);
    }

    await portfolio.create(data);
    delete data.worker_id;
    response(res, data, 201, "add portfolio success");
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
    const { rows } = await portfolio.selectAll({ worker_id: user.id });
    response(res, rows, 200, "get portfolio success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};
const selectByWorker = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { rows } = await portfolio.selectAll({ worker_id: id });
    response(res, rows, 200, "get portfolio success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const drop = async (req, res, next) => {
  try {
    const id = req.params.id;
    await portfolio.drop({ id });
    response(res, { id }, 200, "delete portfolio success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { application_name, link_repo, portfolio_type } = req.body;
    // Mendapatkan data portfolio yang akan diupdate
    const oldPortfolio = await portfolio.findById(id);
    if (!oldPortfolio) {
      return response(res, null, 404, "Portfolio not found");
    }

    const schema = Joi.object({
      application_name: Joi.string().empty("").required(),
      link_repo: Joi.string().empty("").required(),
      portfolio_type: Joi.string().empty("").required(),
    });

    const { error } = schema.validate({ application_name, link_repo, portfolio_type });
    if (error) {
      // eslint-disable-next-line no-useless-escape
      return response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const image = result.secure_url;

    if (oldPortfolio.image !== null) {
      const publicId = oldPortfolio.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const data = {
      application_name,
      link_repo,
      portfolio_type,
      image: image,
      updated_at: new Date(),
    };
    await portfolio.update(data, id);
    response(res, { id, ...data }, 200, "update portfolio success");
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
