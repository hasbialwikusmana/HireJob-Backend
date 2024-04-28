const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const workers = require("../models/worker");
const users = require("../models/users");

const cloudinary = require("../utils/cloudinary");
const Joi = require("joi");
const commonHelper = require("../helpers/common");

const register = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const { rowCount } = await users.findByEmail(email, {
      relation: "workers",
    });
    if (rowCount) {
      return commonHelper.response(res, null, 409, "Email already exists");
    }

    const schema = Joi.object({
      name: Joi.string().empty("").required(),
      email: Joi.string().empty("").required(),
      phone: Joi.string().empty("").required(),
      password: Joi.string().min(8).empty("").required(),
      confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Confirm password must match password",
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      // eslint-disable-next-line no-useless-escape
      return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    }

    const salt = bcrypt.genSaltSync(10);
    const passwrodHash = bcrypt.hashSync(password, salt);

    const user = {
      id: uuidv4(),
      email,
      password: passwrodHash,
      role: "worker",
    };
    const worker = {
      id: uuidv4(),
      name,
      user_id: user.id,
      phone,
    };
    await users.create(user);
    await workers.register(worker);

    commonHelper.response(res, null, 201, "Register success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const update = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email);
    const { name, job_desk, domicile, workplace, description, photo } = req.body;
    // const schema = Joi.object({
    //   name: Joi.string().empty("").required(),
    //   job_desk: Joi.string().empty("").required(),
    //   domicile: Joi.string().empty("").required(),
    //   workplace: Joi.string().empty("").required(),
    //   description: Joi.string().empty("").required(),
    // });

    // const { error } = schema.validate(req.body);

    // if (error) {
    //   // eslint-disable-next-line no-useless-escape
    //   return commonHelper.response(res, null, 400, error.details[0].message.replace(/\"/g, ""));
    // }

    // let photo = req.file;
    // const result = await cloudinary.uploader.upload(photo.path);
    // const image = result.secure_url;

    const data = {
      name,
      job_desk,
      domicile,
      workplace,
      description,
      photo,
    };

    // if (user.photo !== null && user.photo !== undefined) {
    //   // Check if user.photo is defined
    //   const public_id = user.photo.split("/").pop().split(".").shift(); // Check if user.photo is defined
    //   await cloudinary.uploader.destroy(public_id);
    // }

    await workers.update(data, user.user_id);
    commonHelper.response(res, data, 200, "update profile workers success ");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const profile = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "workers" });
    if (!user) {
      return next(new createError[403]());
    }
    delete user.password;
    commonHelper.response(res, user, 200, "get workers success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const updateImage = async (req, res, next) => {
  try {
    const emailAuth = req.decoded.email;

    const {
      rows: [user],
    } = await users.findByEmail(emailAuth);

    if (!req.file) {
      return commonHelper.response(res, null, 400, "Image is required");
    }

    let photo = req.file;
    if (!photo) {
      return commonHelper.response(res, null, 400, "Photo is required");
    }

    const result = await cloudinary.uploader.upload(photo.path);
    const image = result.secure_url;

    const data = {
      photo: image,
    };

    if (user.photo !== null && user.photo !== undefined) {
      const public_id = user.photo.split("/").pop().split(".").shift();
      await cloudinary.uploader.destroy(public_id);
    }
    await workers.updateImage(data, user.user_id);
    commonHelper.response(res, data, 200, "update profile recruiter success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

const detail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      rows: [worker],
    } = await workers.findOne({ id });
    if (!worker) {
      throw new Error("Worker not found");
    }
    commonHelper.response(res, worker, 200, "get workers success");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const selectAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort || "created_at";
  const sortBy = req.query.sortBy || "ASC";
  const search = req.query.search || "";
  const offset = (page - 1) * limit;
  let result = [];
  const { rows } = await workers.findAll({
    limit,
    offset,
    search,
    sort,
    sortBy,
  });
  for (const obj of rows) {
    const { rows: skillsRes } = await workers.selectSkillWorker({ id: obj.id });
    const skills = skillsRes.map(([item]) => {
      return item;
    });

    // const { rows: portfolioRes } = await workers.selectPortfolioWorker({ id: obj.id });
    // const portfolio = portfolioRes.map(([item]) => {
    //   return item;
    // });

    result = [
      ...result,
      {
        ...obj,
        skills: skills,
        // portfolio: portfolio,
      },
    ];
  }

  const {
    rows: [count],
  } = await workers.countWorkers({ search });
  const totalData = parseInt(count.total);
  const totalPage = Math.ceil(totalData / limit);
  const pagination = {
    page: page,
    limit,
    totalData,
    totalPage,
  };
  commonHelper.response(res, result, 200, "success get data workers", pagination);
};

const deleteWorker = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      rows: [worker],
    } = await workers.findOne({ id });
    if (!worker) {
      throw new Error("Worker not found");
    }

    if (worker.photo !== null) {
      const public_id = worker.photo.split("/").pop().split(".").shift();
      await cloudinary.uploader.destroy(public_id);
    }

    await workers.deleteWorker(id);
    commonHelper.response(res, null, 200, "delete worker success");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  register,
  update,
  selectAll,
  profile,
  updateImage,
  detail,
  deleteWorker,
};
