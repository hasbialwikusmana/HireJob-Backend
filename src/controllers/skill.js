const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helpers/common");

const { selectAllSkills, selectWorkerSkills, selectWorkerSkill, selectSkillName, selectWorkerSkillName, insertWorkerSkill, deleteWorkerSkill } = require("../models/skill");

const getAllSkills = async (req, res) => {
  try {
    const results = await selectAllSkills();

    if (!results.rowCount) return commonHelper.response(res, null, 404, "Skills not found");

    commonHelper.response(res, results.rows, 200, "Get all skills successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting skills");
  }
};

const getWorkerSkills = async (req, res) => {
  try {
    const id_worker = req.params.id_worker;
    const {
      rows: [worker],
    } = await selectWorkerSkills(id_worker);
    if (!worker) return commonHelper.response(res, null, 404, "Worker not found");

    commonHelper.response(res, worker, 200, "Get all skills successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting skills");
  }
};

const getDetailSkill = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      rows: [skill],
    } = await selectWorkerSkill(id);
    if (!skill) return commonHelper.response(res, null, 404, "Skill not found");

    commonHelper.response(res, skill, 200, "Get detail skill successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting detail skill");
  }
};

const createSkill = async (req, res) => {
  try {
    const id_worker = req.payload.id;
    const data = req.body;
    let result;

    const skillResult = await selectSkillName(data.name);

    const workerSkillResult = await selectWorkerSkillName(id_worker, data.name);
    if (workerSkillResult.rowCount) return commonHelper.response(res, null, 403, "User already have " + data.name + " skill");

    if (skillResult.rowCount) {
      const insertSkill = {
        id: uuidv4(),
        id_worker: id_worker,
        id_skill: skillResult.rows[0].id,
      };
      result = await insertWorkerSkill(insertSkill);
    } else {
      const id1 = uuidv4();
      const id2 = uuidv4();

      const newSkill = {
        id: id1,
        name: data.name,
      };
      await insertSkill(newSkill);

      const insertSkill = {
        id: id2,
        id_worker: id_worker,
        id_skill: newSkill.id,
      };
      result = await insertWorkerSkill(insertSkill);
    }

    commonHelper.response(res, result.rows, 200, "Create skill successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed creating skill");
  }
};

const deleteSkill = async (req, res) => {
  try {
    const id = req.params.id;
    const { rowCount } = await selectWorkerSkill(id);
    if (!rowCount) return commonHelper.response(res, null, 404, "Skill not found");

    const result = deleteWorkerSkill(id);
    commonHelper.response(res, result.rows, 200, "Skill deleted");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed deleting skill");
  }
};

module.exports = {
  getAllSkills,
  getWorkerSkills,
  getDetailSkill,
  createSkill,
  deleteSkill,
};
