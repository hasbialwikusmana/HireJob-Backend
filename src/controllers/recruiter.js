const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const users = require("../models/users");
const recruiters = require("../models/recruiter");
const cloudinary = require("../utils/cloudinary");
const Joi = require("joi");
const commonHelper = require("../helpers/common");

const register = async (req, res, next) => {
  try {
    const { email, password, name, company, position, phone } = req.body;
    const { rowCount } = await users.findByEmail(email, {
      relation: "recruiters",
    });
    if (rowCount) {
      return commonHelper.response(res, null, 409, "Email already exists");
    }

    const schema = Joi.object({
      name: Joi.string().empty("").required(),
      email: Joi.string().empty("").required(),
      company: Joi.string().empty("").required(),
      position: Joi.string().empty("").required(),
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
      role: "recruiter",
    };
    const recruiter = {
      id: uuidv4(),
      user_id: user.id,
      name,
      company,
      position,
      phone,
    };
    await users.create(user);
    await recruiters.register(recruiter);
    commonHelper.response(res, null, 201, "User successfully registered");
  } catch (error) {
    console.error(error); // Tambahkan baris ini
    next(new createError.InternalServerError());
  }
};

const update = async (req, res, next) => {
  try {
    const emailAuth = req.decoded.email;
    const { company, position, city, description, instagram, linkedin, phone, email, photo } = req.body;
    const {
      rows: [user],
    } = await users.findByEmail(emailAuth);

    const data = {
      company,
      position,
      city,
      description,
      instagram,
      linkedin,
      phone,
      photo,
    };
    if (email && emailAuth != email) {
      await users.updateEmail({ email: email }, user.user_id);
    }
    await recruiters.update(data, user.user_id);
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
    } = await users.findByEmail(email, { relation: "recruiters" });
    if (!user) {
      return next(new createError[403]());
    }
    delete user.password;
    commonHelper.response(res, user, 200, "get recruiters success");
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
      // Check if user.photo is defined
      const public_id = user.photo.split("/").pop().split(".").shift(); // Check if user.photo is defined
      await cloudinary.uploader.destroy(public_id);
    }
    await recruiters.updateImage(data, user.user_id);
    commonHelper.response(res, data, 200, "update profile recruiter success");
  } catch (error) {
    console.log(error);
    next(new createError.InternalServerError());
  }
};

module.exports = {
  register,
  update,
  updateImage,
  profile,
};
