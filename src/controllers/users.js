const commonHelper = require("../helpers/common");
const authHelper = require("../helpers/auth");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const errorServ = new createError.InternalServerError();
const { v4: uuidv4 } = require("uuid");

const { findEmail, createUser } = require("../models/users");

const usersControllers = {
  register: async (req, res) => {
    try {
      const { name, email, nohp, password, role } = req.body;

      const { rowCount } = await findEmail(email);
      if (rowCount) {
        return commonHelper.response(res, null, 409, "Email already exists");
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
        return commonHelper.response(res, null, 400, "Role must be workers or recruiters");
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
        return commonHelper.response(res, null, 404, "Email not found");
      }
      const isValidPassword = bcrypt.compareSync(password, users.password);

      if (!isValidPassword) {
        return commonHelper.response(res, null, 401, "Password is incorrect");
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
        delete users.linkedin;

        commonHelper.response(res, users, 200, "Login Worker success");
      } else if (users.role === "recruiters") {
        delete users.jobdesk;
        delete users.github;
        delete users.gitlab;
        delete users.workplace;

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
};

module.exports = usersControllers;
