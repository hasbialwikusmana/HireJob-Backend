const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helpers/common");

const skillModel = require("../models/skill");

const skillControllers = {
  getAllSkills: async (req, res) => {
    try {
      const results = await skillModel.selectAllSkills();

      if (!results.rowCount) return commonHelper.response(res, null, 404, "Skills not found");

      //Response
      commonHelper.response(res, results.rows, 200, "Get all skills successful");
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed getting skills");
    }
  },

  getWorkerSkills: async (req, res) => {
    try {
      const id_worker = req.params.id_worker;
      const results = await skillModel.selectWorkerSkills(id_worker);
      if (!results.rowCount) return commonHelper.response(res, null, 404, "Worker skills not found");

      commonHelper.response(res, results.rows, 200, "Get all skills successful");
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed getting skills");
    }
  },

  getDetailSkill: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await skillModel.selectWorkerSkill(id);

      if (!result.rowCount) return commonHelper.response(res, null, 404, "Skill not found");

      //Response
      commonHelper.response(res, result.rows, 200, "Get detail skill successful");
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed getting detail skill");
    }
  },

  createSkill: async (req, res) => {
    try {
      const id_worker = req.payload.id;
      const data = req.body;
      let result;

      const skillResult = await skillModel.selectSkillName(data.name);

      const workerSkillResult = await skillModel.selectWorkerSkillName(id_worker, data.name);
      if (workerSkillResult.rowCount) return commonHelper.response(res, null, 403, "User already have " + data.name + " skill");

      if (skillResult.rowCount) {
        const insertSkill = {
          id: uuidv4(),
          id_worker: id_worker,
          id_skill: skillResult.rows[0].id,
        };
        result = await skillModel.insertWorkerSkill(insertSkill);
      } else {
        const id1 = uuidv4();
        const id2 = uuidv4();

        const newSkill = {
          id: id1,
          name: data.name,
        };
        await skillModel.insertSkill(newSkill);

        const insertSkill = {
          id: id2,
          id_worker: id_worker,
          id_skill: newSkill.id,
        };
        result = await skillModel.insertWorkerSkill(insertSkill);
      }

      //Response
      commonHelper.response(res, result.rows, 200, "Create skill successful");
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed creating skill");
    }
  },

  deleteSkill: async (req, res) => {
    try {
      const id = req.params.id;
      const { rowCount } = await skillModel.selectWorkerSkill(id);
      if (!rowCount) return commonHelper.response(res, null, 404, "Skill not found");

      const result = skillModel.deleteWorkerSkill(id);
      commonHelper.response(res, result.rows, 200, "Skill deleted");
    } catch (error) {
      console.log(error);
      commonHelper.response(res, null, 500, "Failed deleting skill");
    }
  },
};

module.exports = skillControllers;
