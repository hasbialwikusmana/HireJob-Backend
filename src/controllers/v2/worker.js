const commonHelper = require("../../helpers/common");
const cloudinary = require("../../middlewares/cloudinary");

const { findEmail, findId, deleteUsersAccount } = require("../../models/v1/users");
const { selectAllWorker, selectProfileWorker, updateWorker, updateImageWorker } = require("../../models/v1/worker");

const { selectWorkerSkills } = require("../../models/v1/skill");
const { selectWorkerPortfolios } = require("../../models/v1/portfolio");
const { selectWorkerWorkExperiences } = require("../../models/v1/workExperience");

const workerControllers = {
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

  getWorkerById: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        rows: [worker],
      } = await selectProfileWorker(id);
      if (!worker) return commonHelper.response(res, null, 404, "Worker not found");

      const skills = await selectWorkerSkills(id);
      const portfolios = await selectWorkerPortfolios(id);
      const workExperiences = await selectWorkerWorkExperiences(id);

      const data = {
        ...worker,
        skills: skills.rows,
        portfolios: portfolios.rows,
        workExperiences: workExperiences.rows,
      };

      commonHelper.response(res, data, 200, "Get detail worker successful");
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
      updateWorker(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Worker updated");
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
      } = await findId(id);

      const data = {
        id: users.id,
        image,
      };

      if (users.image !== null) {
        const public_id = users.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      updateImageWorker(data)
        .then((result) => commonHelper.response(res, result.rows, 200, "Update image success"))
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

module.exports = workerControllers;
