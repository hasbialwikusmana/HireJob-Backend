const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../../helpers/common");
const cloudinary = require("../../middlewares/cloudinary");
const workExperienceModel = require("../../models/v1/workExperience");

const getAllWorkExperiences = async (req, res) => {
  try {
    const results = await workExperienceModel.selectAllWorkExperiences();

    if (!results.rowCount) return commonHelper.response(res, null, 404, "Work experiences not found");

    commonHelper.response(res, results.rows, 200, "Get all work experiences successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting work experiences");
  }
};

const getWorkerWorkExperiences = async (req, res) => {
  try {
    const id_worker = req.params.id_worker;

    const {
      rows: [worker],
    } = await workExperienceModel.selectWorkerWorkExperiences(id_worker);
    if (!worker) return commonHelper.response(res, null, 404, "Worker work experience not found");

    commonHelper.response(res, worker, 200, "Get all work experiences successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting work experiences");
  }
};

const getDetailWorkExperience = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      rows: [workExperience],
    } = await workExperienceModel.selectWorkExperience(id);
    if (!workExperience) return commonHelper.response(res, null, 404, "Work experience not found");

    commonHelper.response(res, workExperience, 200, "Get detail work experience successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting detail work experience");
  }
};

const createWorkExperience = async (req, res) => {
  try {
    const id_worker = req.payload.id;
    const data = req.body;

    data.id = uuidv4();
    data.id_worker = id_worker;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      data.image = uploadResult.secure_url;
    } else {
      data.image = "";
    }

    const result = await workExperienceModel.insertWorkExperience(data);

    commonHelper.response(res, result.rows, 200, "Create work experience successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed creating work experience");
  }
};

const updateWorkExperience = async (req, res) => {
  try {
    const id = req.params.id;
    const id_worker = req.payload.id_worker;
    const newData = req.body;

    const oldDataResult = await workExperienceModel.selectWorkExperience(id);
    if (!oldDataResult.rowCount) return commonHelper.response(res, null, 404, "Work experience not found");
    let oldData = oldDataResult.rows[0];
    let data = { ...oldData, ...newData };

    data.id = id;
    data.id_worker = id_worker;

    if (req.file) {
      if (oldData.image !== "") {
        const public_id = oldData.image.split("/").pop().split(".").shift();
        await cloudinary.uploader.destroy(public_id);
      }

      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      data.image = uploadResult.secure_url;
    } else {
      data.image = oldData.image;
    }

    const result = await workExperienceModel.updateWorkExperience(data);

    commonHelper.response(res, result.rows, 200, "Update work experience successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed updating work experience");
  }
};

const deleteWorkExperience = async (req, res) => {
  try {
    const id = req.params.id;

    const oldResult = await workExperienceModel.selectWorkExperience(id);
    if (!oldResult.rowCount) return commonHelper.response(res, null, 404, "Work experience not found");

    if (oldResult.rows[0].image !== "") {
      const public_id = oldResult.rows[0].image.split("/").pop().split(".").shift();
      await cloudinary.uploader.destroy(public_id);
    }

    const result = await workExperienceModel.deleteWorkExperience(id);

    commonHelper.response(res, result.rows, 200, "Work experience deleted");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed deleting work experience");
  }
};

module.exports = {
  getAllWorkExperiences,
  getWorkerWorkExperiences,
  getDetailWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
};
