const commonHelper = require("../helpers/common");
const authHelper = require("../helpers/auth");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const errorServ = new createError.InternalServerError();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary");

const { findEmail, selectAllRecruiters, createUser, updatePhotoUser, updateBanner, updaterecruiter, deleteRecruiter } = require("../models/recruiter");

const recruiterController = {
  getAllRecruiter: async (req, res) => {
    try {
      const { rows } = await selectAllRecruiters();
      commonHelper.response(res, rows, 200);
    } catch (error) {
      console.log(error);
    }
  },

  registerRecruiter: async (req, res) => {
    try {
      const { name, email, company_name, jobdesk, phone_number, password } = req.body;
      const { rowCount } = await findEmail(email);
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const id = uuidv4();

      if (rowCount) {
        return res.json({
          Message: "Email is already exist",
        });
      }

      let data = {
        id,
        name,
        email,
        company_name,
        jobdesk,
        phone_number,
        password: passwordHash,
      };
      createUser(data)
        .then((result) => commonHelper.response(res, result.rows, 201, "Register success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [recruiter],
      } = await findEmail(email);
      if (!recruiter) {
        return res.status(403).json({
          Message: "Email is invalid",
        });
      }
      const isValidPassword = bcrypt.compareSync(password, recruiter.password);

      if (!isValidPassword) {
        return res.status(403).json({
          Message: "Password is invalid",
        });
      }
      delete recruiter.password;
      const payload = {
        email: recruiter.email,
        id: recruiter.id,
      };
      recruiter.token = authHelper.generateToken(payload);
      recruiter.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, recruiter, 201, "login is successful");
    } catch (error) {
      console.log(error);
      next(errorServ);
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
    const payload = {
      email: decoded.email,
      id: decoded.id,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Refresh token success");
  },

  profileRecruiter: async (req, res) => {
    const email = req.payload.email;

    const {
      rows: [recruiter],
    } = await findEmail(email);
    delete recruiter.password;
    commonHelper.response(res, recruiter, 200);
  },

  updateUserRecruiter: async (req, res) => {
    try {
      const email = req.payload.email;

      const {
        rows: [recruiter],
      } = await findEmail(email);
      const { name, company_name, jobdesk, phone_number, company_field, workplace, description, instagram, linkedin } = req.body;

      const data = {
        id: recruiter.id,
        name,
        company_name,
        jobdesk,
        phone_number,
        company_field,
        workplace,
        description,
        instagram,
        linkedin,
      };
      console.log(data);
      updaterecruiter(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Recruiter updated");
        })
        .catch((err) => res.status(500).json(err));
    } catch (error) {
      console.log(error);
    }
  },

  updatePhotoRecruiter: async (req, res) => {
    try {
      const email = req.payload.email;

      const result = await cloudinary.uploader.upload(req.file.path);
      const image = result.secure_url;

      const {
        rows: [recruiter],
      } = await findEmail(email);

      const data = {
        id: recruiter.id,
        image,
      };

      if (recruiter.image !== null) {
        const public_id = recruiter.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updatePhotoUser(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update photo success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateBannerRecruiter: async (req, res) => {
    try {
      const email = req.payload.email;

      const result = await cloudinary.uploader.upload(req.file.path);
      const banner_image = result.secure_url;

      const {
        rows: [recruiter],
      } = await findEmail(email);

      const data = {
        id: recruiter.id,
        banner_image,
      };

      if (recruiter.banner_image !== null) {
        const public_id = recruiter.banner_image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updateBanner(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update banner success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteRecruiters: async (req, res) => {
    try {
      const email = req.payload.email;

      const {
        rows: [recruiter],
      } = await findEmail(email);

      if (recruiter.image !== null) {
        const public_id = recruiter.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      if (recruiter.banner_image !== null) {
        const public_id = recruiter.banner_image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      deleteRecruiter(email)
        .then((result) => commonHelper.response(res, result.rows, 200, "Delete success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = recruiterController;
