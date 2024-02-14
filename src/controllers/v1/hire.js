const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../../helpers/common");

const { selectAllHires, selectWorkerHires, selectRecruiterHires, selectHire, insertHire, deleteHire } = require("../../models/v1/hire");
const workerModel = require("../../models/v1/worker");

const getAllHires = async (req, res) => {
  try {
    const results = await selectAllHires();

    if (!results.rowCount) return commonHelper.response(res, null, 404, "Hires not found");
    commonHelper.response(res, results.rows, 200, "Get all hires successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting hires");
  }
};

const getWorkerHires = async (req, res) => {
  try {
    const id_worker = req.params.id_worker;
    const {
      rows: [worker],
    } = await selectWorkerHires(id_worker);
    if (!worker) return commonHelper.response(res, null, 404, "Worker not found");

    commonHelper.response(res, worker, 200, "Get all hires successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting hires");
  }
};

const getRecruiterHires = async (req, res) => {
  try {
    const id_recruiter = req.payload.id;
    const {
      rows: [recruiter],
    } = await selectRecruiterHires(id_recruiter);
    if (!recruiter) return commonHelper.response(res, null, 404, "Recruiter not found");
    console.log(recruiter);
    commonHelper.response(res, recruiter, 200, "Get all hires successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting hires");
  }
};

const getDetailHire = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      rows: [hire],
    } = await selectHire(id);
    if (!hire) return commonHelper.response(res, null, 404, "Hire not found");

    commonHelper.response(res, hire, 200, "Get detail hire successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting detail hire");
  }
};

const createHire = async (req, res) => {
  try {
    const id_worker = req.params.id_worker;
    const id_recruiter = req.payload.id;
    const { reason, name, email, nohp, description } = req.body;

    const workerResult = await workerModel.selectProfileWorker(id_worker);
    if (!workerResult.rowCount) {
      return commonHelper.response(res, null, 403, "Worker id is not found");
    }

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

    const result = await insertHire(data);

    commonHelper.response(res, result.rows, 201, "Hire created");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed hiring worker");
  }
};

const deleteHires = async (req, res) => {
  try {
    const id = req.params.id;
    const { rowCount } = await selectHire(id);
    if (!rowCount) return commonHelper.response(res, null, 404, "Hire not found");

    const result = deleteHire(id);
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
  deleteHires,
};
