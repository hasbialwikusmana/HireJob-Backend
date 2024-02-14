const commonHelper = require("../../helpers/common");
const cloudinary = require("../../middlewares/cloudinary");

const { findEmail, findId, deleteUsersAccount } = require("../../models/v1/users");
const { selectAllRecruiter, selectProfileRecruiter, updateRecruiter, updateImageRecruiter, updateBannerRecruiter } = require("../../models/v1/recruiter");

const getAllRecruiter = async (req, res) => {
  try {
    const filter = req.query.filter || "name";
    const searchQuery = req.query.search || "";
    const sortBy = req.query.sortBy || "name";
    const sort = req.query.sort || "asc";
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const results = await selectAllRecruiter(filter, searchQuery, sortBy, sort, limit, offset);

    if (!results.rowCount) return commonHelper.response(res, null, 404, "Recruiters not found");

    const totalData = Number(results.rowCount);
    const totalPage = Math.ceil(totalData / limit);
    const pagination = {
      currentPage: page,
      limit: limit,
      totalData: totalData,
      totalPage: totalPage,
    };
    commonHelper.response(res, results.rows, 200, "Get all recruiters successful", pagination);
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting recruiters");
  }
};
const getRecruiterById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      rows: [recruiter],
    } = await selectProfileRecruiter(id);
    if (!recruiter) return commonHelper.response(res, null, 404, "Recruiter not found");

    commonHelper.response(res, recruiter, 200, "Get detail recruiter successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting detail Recruiter");
  }
};
const updateProfileRecruiter = async (req, res) => {
  try {
    const id = req.params.id;

    const { company_name, company_field, residence, description, email, nohp, instagram } = req.body;

    const data = {
      id,
      company_name,
      company_field,
      residence,
      description,
      email,
      nohp,
      instagram,
    };

    updateRecruiter(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "Recruiter updated");
      })
      .catch((err) => res.status(500).json(err));
  } catch (error) {
    console.log(error);
  }
};

const updateImageProfile = async (req, res) => {
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

    updateImageRecruiter(data)
      .then((result) => commonHelper.response(res, result.rows, 200, "Update image success"))
      .catch((err) => res.send(err));
  } catch (error) {
    console.log(error);
  }
};

const updateBannerProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await cloudinary.uploader.upload(req.file.path);
    const banner_image = result.secure_url;

    const {
      rows: [users],
    } = await findId(id);

    const data = {
      id: users.id,
      banner_image,
    };

    if (users.banner_image !== null) {
      const public_id = users.banner_image.split("/").pop().split(".").shift();
      await cloudinary.uploader.destroy(public_id);
    }

    updateBannerRecruiter(data)
      .then((result) => commonHelper.response(res, result.rows, 200, "Update banner success"))
      .catch((err) => res.send(err));
  } catch (error) {
    console.log(error);
  }
};

const deleteUsers = async (req, res) => {
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
};

module.exports = {
  getAllRecruiter,
  getRecruiterById,
  updateProfileRecruiter,
  updateImageProfile,
  updateBannerProfile,
  deleteUsers,
};
