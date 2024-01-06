const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helpers/common");

const hireModel = require("../models/hire");
const workerModel = require("../models/worker");

const getAllHires = async (req, res) => {
  try {
    //Get all hires from database
    const results = await hireModel.selectAllHires();

    //Return not found if there's no hires in database
    if (!results.rowCount) return commonHelper.response(res, null, 404, "Hires not found");

    //Response
    commonHelper.response(res, results.rows, 200, "Get all hires successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting hires");
  }
};

const getWorkerHires = async (req, res) => {
  try {
    //Get request worker id
    const id_worker = req.params.id_worker;

    //Get worker hires from database
    const results = await hireModel.selectWorkerHires(id_worker);

    //Return not found if there's no hires in database
    if (!results.rowCount) return commonHelper.response(res, null, 404, "Worker hires not found");

    //Response
    commonHelper.response(res, results.rows, 200, "Get all hires successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting hires");
  }
};

const getRecruiterHires = async (req, res) => {
  try {
    //Get request worker id
    const id_recruiter = req.params.id_recruiter;
    //Get worker hires from database
    const results = await hireModel.selectRecruiterHires(id_recruiter);

    //Return not found if there's no hires in database
    if (!results.rowCount) return commonHelper.response(res, null, 404, "Recruiter hires not found");

    //Response
    commonHelper.response(res, results.rows, 200, "Get all hires successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting hires");
  }
};

const getDetailHire = async (req, res) => {
  try {
    //Get request hire id
    const id = req.params.id;

    //Get hire by id from database
    const result = await hireModel.selectHire(id);

    //Return not found if there's no hire in database
    if (!result.rowCount) return commonHelper.response(res, null, 404, "Hire not found");

    //Response
    commonHelper.response(res, result.rows, 200, "Get detail hire successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting detail hire");
  }
};

const createHire = async (req, res) => {
  try {
    // Dapatkan request worker id dan recruiter id
    const id_worker = req.params.id_worker;
    const id_recruiter = req.payload.id;
    const { reason, name, email, nohp, description } = req.body;

    // Periksa apakah worker ada
    const workerResult = await workerModel.selectProfileWorker(id_worker);
    if (!workerResult.rowCount) {
      return commonHelper.response(res, null, 403, "Worker id is not found");
    }

    // Metadata Hire
    const data = {
      id: uuidv4(),
      id_worker,
      id_recruiter,
      reason,
      name,
      email,
      nohp,
      description,
    };
    // console.log(data);

    // Masukkan hire ke database
    const result = await hireModel.insertHire(data);
    // console.log(result);

    // Respon
    commonHelper.response(res, result.rows, 201, "Hire created");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed hiring worker");
  }
};

const deleteHire = async (req, res) => {
  try {
    const id = req.params.id;
    const { rowCount } = await hireModel.selectHire(id);
    if (!rowCount) return commonHelper.response(res, null, 404, "Hire not found");

    const result = hireModel.deleteHire(id);
    commonHelper.response(res, result.rows, 200, "Hire deleted");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed deleting hire");
  }
};

module.exports = {
  getAllHires,
  getWorkerHires,
  getRecruiterHires,
  getDetailHire,
  createHire,
  deleteHire,
};
