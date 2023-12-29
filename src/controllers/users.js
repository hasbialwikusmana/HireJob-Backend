const commonHelper = require("../helpers/common");
const authHelper = require("../helpers/auth");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const errorServ = new createError.InternalServerError();
const { v4: uuidv4 } = require("uuid");
// const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary");

const { findEmail, createUser, updateUsers, updateUsersRecruiter, selectProfile, selectProfileDetail, selectProfileRecruiter, updateImageUsers, updateImageBannerUsers, deleteUsersAccount } = require("../models/users");
const { selectWorkerSkills } = require("../models/skill");
const { selectWorkerPortfolios } = require("../models/portfolio");
const { selectWorkerWorkExperiences } = require("../models/workExperience");

const usersControllers = {
  // getAllWorker: async (req, res) => {
  //   try {
  //     const filter = req.query.filter || "name";
  //     const searchQuery = req.query.search || "";
  //     const sortBy = req.query.sortBy || "name";
  //     const sort = req.query.sort || "asc";
  //     const limit = Number(req.query.limit) || 5;
  //     const page = Number(req.query.page) || 1;
  //     const offset = (page - 1) * limit;
  //     const results = await selectAllWorker(filter, searchQuery, sortBy, sort, limit, offset);

  //     if (!results.rowCount) return commonHelper.response(res, null, 404, "Workers not found");

  //     const totalData = Number(results.rowCount);
  //     const totalPage = Math.ceil(totalData / limit);
  //     const pagination = {
  //       currentPage: page,
  //       limit: limit,
  //       totalData: totalData,
  //       totalPage: totalPage,
  //     };
  //     commonHelper.response(res, results.rows, 200, "Get all workers successful", pagination);
  //   } catch (error) {
  //     console.log(error);
  //     commonHelper.response(res, null, 500, "Failed getting workers");
  //   }
  // },

  register: async (req, res) => {
    try {
      const { name, email, nohp, password, role } = req.body;

      // Check if email already exists
      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return res.json({
          Message: "Email is already exist",
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

      if (role !== "workers" && role !== "recruiters") {
        return res.json({
          Message: "Invalid role. Only 'workers' or 'recruiters' is allowed",
        });
      }

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
        rows: [users],
      } = await findEmail(email);
      if (!users) {
        return res.status(403).json({
          Message: "Email is invalid",
        });
      }
      const isValidPassword = bcrypt.compareSync(password, users.password);

      if (!isValidPassword) {
        return res.status(403).json({
          Message: "Password is invalid",
        });
      }

      delete users.password;
      const payload = {
        email: users.email,
        role: users.role,
        id: users.id,
      };

      users.token = authHelper.generateToken(payload);
      if (users.role === "workers") {
        delete users.company_name;
        delete users.company_field;
        delete users.banner_image;
        delete users.instagram;
        delete users.linkedin;
        // delete users.role;
        commonHelper.response(res, users, 200, "Login Worker success");
      } else if (users.role === "recruiters") {
        delete users.jobdesk;
        delete users.github;
        delete users.gitlab;
        delete users.workplace;
        // delete users.role;
        commonHelper.response(res, users, 200, "Login Recruiter success");
      }
    } catch (error) {
      console.log(error);
      next(errorServ);
    }
  },

  getProfile: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [users],
    } = await findEmail(email);
    if (users.role === "workers") {
      delete users.password;
      delete users.company_name;
      delete users.company_field;
      delete users.banner_image;
      delete users.instagram;
      delete users.role;
      commonHelper.response(res, users, 200, "Get Profile Worker success");
    } else if (users.role === "recruiters") {
      delete users.password;
      delete users.role;
      delete users.jobdesk;
      delete users.github;
      delete users.gitlab;
      delete users.workplace;
      commonHelper.response(res, users, 200, "Get Profile Recruiter success");
    }
  },

  getProfileById: async (req, res) => {
    try {
      const id = req.params.id;

      if (req.payload.role === "workers") {
        const result = await selectProfileDetail(id);

        if (!result.rowCount) return commonHelper.response(res, null, 404, "Worker not found");

        // //Get worker skills from database
        const resultSkills = await selectWorkerSkills(id);
        result.rows[0].skill = resultSkills.rows;

        // //Get portfolios from database
        const resultPortfolios = await selectWorkerPortfolios(id);
        result.rows[0].portfolio = resultPortfolios.rows;

        // //Get worker work experiences from database
        const resultWorkExperiences = await selectWorkerWorkExperiences(id);
        result.rows[0].workExperience = resultWorkExperiences.rows;

        commonHelper.response(res, result.rows, 200, "Get detail worker successful");
      }
      if (req.payload.role === "recruiters") {
        const result = await selectProfileRecruiter(id);

        if (!result.rowCount) return commonHelper.response(res, null, 404, "Recruiter not found");

        commonHelper.response(res, result.rows, 200, "Get detail recruiter successful");
      }
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed getting detail worker");
    }
  },

  updateProfileWorker: async (req, res) => {
    try {
      const id = req.params.id;

      const { name, nohp, jobdesk, residence, workplace, description, job_type, instagram, github, gitlab } = req.body;

      const data = {
        id,
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
      console.log(data);
      updateUsers(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Worker updated");
        })
        .catch((err) => res.status(500).json(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateProfileRecruiter: async (req, res) => {
    try {
      const id = req.params.id;

      const { name, nohp, company_name, company_field, description, instagram, linkedin } = req.body;

      const data = {
        id,
        name,
        nohp,
        company_name,
        company_field,
        description,
        instagram,
        linkedin,
      };

      updateUsersRecruiter(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Recruiter updated");
        })
        .catch((err) => res.status(500).json(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateImageProfile: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await cloudinary.uploader.upload(req.file.path);
      const image = result.secure_url;

      const {
        rows: [users],
      } = await selectProfile(id);

      const data = {
        id: users.id,
        image,
      };
      console.log(data);

      if (users.image !== null) {
        const public_id = users.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updateImageUsers(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update image success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateBannerProfile: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await cloudinary.uploader.upload(req.file.path);
      const banner_image = result.secure_url;

      const {
        rows: [users],
      } = await selectProfile(id);

      const data = {
        id: users.id,
        banner_image,
      };
      console.log(data);

      if (users.banner_image !== null) {
        const public_id = users.banner_image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updateImageBannerUsers(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update banner success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteUsers: async (req, res) => {
    try {
      const email = req.payload.email;

      const {
        rows: [users],
      } = await findEmail(email);

      if (users.image !== null) {
        const public_id = users.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      deleteUsersAccount(email)
        .then((result) => commonHelper.response(res, result.rows, 200, "Delete success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = usersControllers;
