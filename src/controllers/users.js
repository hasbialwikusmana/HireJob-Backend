const commonHelper = require("../helpers/common");
const authHelper = require("../helpers/auth");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const errorServ = new createError.InternalServerError();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary");

const { findEmail, createUser, updateUser, updatePhotoUser, updaterecruiter } = require("../models/users");

const userController = {
  registerWorker: async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;
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
        email,
        password: passwordHash,
        name,
        phone,
        role: "worker",
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
        rows: [user],
      } = await findEmail(email);
      if (!user) {
        return res.status(403).json({
          Message: "Email is invalid",
        });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return res.status(403).json({
          Message: "Password is invalid",
        });
      }
      delete user.password;
      const payload = {
        email: user.email,
        role: user.role,
        id: user.id,
      };
      console.log(payload);
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, user, 201, "login is successful");
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
      role: decoded.role,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Refresh token success");
  },
  profileWorker: async (req, res) => {
    const email = req.payload.email;
    const role = req.payload.role;
    if (role == "recruiter") {
      return res.json({
        Message: "unauthorized",
      });
    }
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    if (role == "worker") {
      delete user.company;
      delete user.position;
    }
    commonHelper.response(res, user, 200);
  },

  // recrutiter
  registerRecruiter: async (req, res) => {
    try {
      const { email, password, name, phone, company, position } = req.body;
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
        email,
        password: passwordHash,
        name,
        phone,
        company,
        position,
        role: "recruiter",
      };
      createUser(data)
        .then((result) => commonHelper.response(res, result.rows, 201, "Register success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  profileRecruiter: async (req, res) => {
    const email = req.payload.email;
    const role = req.payload.role;
    if (role == "worker") {
      return res.json({
        Message: "unauthorized",
      });
    }
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200);
  },
  updateUserWorker: async (req, res) => {
    try {
      const email = req.payload.email;
      const role = req.payload.role;
      if (role !== "worker") {
        return res.json({
          Message: "unauthorized",
        });
      }
      const {
        rows: [user],
      } = await findEmail(email);
      const { name, phone, description } = req.body;

      const data = { id: user.id, name, phone, description };
      console.log(data);
      updateUser(data)
        .then((result) => {
          console.log(result);
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
      const role = req.payload.role;

      // Pastikan peran pengguna adalah "worker" sebelum melanjutkan
      if (role !== "worker") {
        return res.status(403).json({
          message: "Unauthorized. Only workers can update their photo.",
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      const photo = result.secure_url;

      const {
        rows: [user],
      } = await findEmail(email);

      const data = {
        id: user.id,
        photo,
      };

      if (user.photo !== null) {
        const public_id = user.photo.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updatePhotoUser(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update photo success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  updateUserRecruiter: async (req, res) => {
    try {
      const email = req.payload.email;
      const role = req.payload.role;
      if (role !== "recruiter") {
        return res.json({
          Message: "unauthorized",
        });
      }
      const {
        rows: [user],
      } = await findEmail(email);
      const { name, phone, description, company, position } = req.body;

      const data = { id: user.id, name, phone, description, company, position };
      console.log(data);
      updaterecruiter(data)
        .then((result) => {
          console.log(result);
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
      const role = req.payload.role;

      // Pastikan peran pengguna adalah "worker" sebelum melanjutkan
      if (role !== "recruiter") {
        return res.status(403).json({
          message: "Unauthorized. Only workers can update their photo.",
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      const photo = result.secure_url;

      const {
        rows: [user],
      } = await findEmail(email);

      const data = {
        id: user.id,
        photo,
      };

      if (user.photo !== null) {
        const public_id = user.photo.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updatePhotoUser(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update photo success"))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = userController;
