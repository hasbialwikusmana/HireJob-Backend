const commonHelper = require("../helpers/common");
const authHelper = require("../helpers/auth");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const errorServ = new createError.InternalServerError();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary");

const { findEmail, selectAllWorker, selectWorker, createUser, updateUser, updatePhotoUser, deleteWorker } = require("../models/worker");

const workerController = {
  getAllWorker: async (req, res) => {
    try {
      const filter = req.query.filter || "name";
      const searchQuery = req.query.search || "";
      const sortBy = req.query.sortBy || "name";
      const sort = req.query.sort || "asc";
      const limit = Number(req.query.limit) || 5;
      const page = Number(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const results = await selectAllWorker(filter, searchQuery, sortBy, sort, limit, offset);

      if (!results.rowCount) return commonHelper.response(res, null, 404, "Workers not found");

      const totalData = Number(results.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, results.rows, 200, "Get all workers successful", pagination);
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed getting workers");
    }
  },

  registerWorker: async (req, res) => {
    try {
      const { name, email, nohp, password, confirmPassword, role } = req.body;

      // Check if email already exists
      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return res.json({
          Message: "Email is already exist",
        });
      }
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.json({
          Message: "Password and confirm password do not match",
        });
      }

      // Check if role is not "workers"
      if (role !== "workers") {
        return res.json({
          Message: "Invalid role. Registration is only allowed for workers",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const id = uuidv4();

      let data = {
        id,
        name,
        email,
        nohp,
        password: passwordHash,
        role,
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
      const { email, password, role } = req.body;
      const {
        rows: [worker],
      } = await findEmail(email);
      if (!worker) {
        return res.status(403).json({
          Message: "Email is invalid",
        });
      }
      const isValidPassword = bcrypt.compareSync(password, worker.password);

      if (!isValidPassword) {
        return res.status(403).json({
          Message: "Password is invalid",
        });
      }
      if (role !== "workers") {
        return res.status(403).json({
          Message: "Role is invalid",
        });
      }
      delete worker.password;
      const payload = {
        email: worker.email,
        role: worker.role,
        id: worker.id,
      };
      console.log(payload);
      worker.token = authHelper.generateToken(payload);
      worker.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, worker, 201, "login is successful");
    } catch (error) {
      console.log(error);
      next(errorServ);
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
    const payload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Refresh token success");
  },
  profileWorker: async (req, res) => {
    try {
      const id = req.payload.id;
      const result = await selectWorker(id);
      if (!result.rowCount) return commonHelper.response(res, null, 404, "Worker not found");

      // //Get worker skills from database
      // const resultSkills = await selectWorkerSkills(id);
      // result.rows[0].skill = resultSkills.rows;

      // //Get portfolios from database
      // const resultPortfolios = await selectWorkerPortfolios(id);
      // result.rows[0].portfolio = resultPortfolios.rows;

      // //Get worker work experiences from database
      // const resultWorkExperiences = await selectWorkerWorkExperiences(id);
      // result.rows[0].workExperience = resultWorkExperiences.rows;

      //Response
      commonHelper.response(res, result.rows, 200, "Get detail worker successful");
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed getting detail worker");
    }
  },

  updateUserWorker: async (req, res) => {
    try {
      const email = req.payload.email;
      const {
        rows: [worker],
      } = await findEmail(email);
      const { name, nohp, jobdesk, residence, workplace, description, job_type, instagram, github, gitlab } = req.body;

      const data = {
        id: worker.id,
        name,
        nohp,
        jobdesk,
        residence,
        workplace,
        description,
        job_type,
        instagram,
        github,
        gitlab,
      };

      updateUser(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Worker updated");
        })
        .catch((err) => res.status(500).json(err));
    } catch (error) {
      console.log(error);
    }
  },

  updatePhotoWorker: async (req, res) => {
    try {
      const email = req.payload.email;

      const result = await cloudinary.uploader.upload(req.file.path);
      const image = result.secure_url;

      const {
        rows: [worker],
      } = await findEmail(email);

      const data = {
        id: worker.id,
        image,
      };

      if (worker.image !== null) {
        const public_id = worker.photo.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updatePhotoUser(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update photo success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteWorkers: async (req, res) => {
    try {
      const email = req.payload.email;

      const {
        rows: [worker],
      } = await findEmail(email);

      if (worker.image !== null) {
        const public_id = worker.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      deleteWorker(email)
        .then((result) => commonHelper.response(res, result.rows, 200, "Delete success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = workerController;
