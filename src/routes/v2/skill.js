const express = require("express");
const router = express.Router();

const { protect, isWorker } = require("../../middlewares/auth");
const { getAllSkills, getDetailSkill, createSkill, deleteSkill } = require("../controllers/skill");
const createSkillValidation = require("../../validations/skill");
const validation = require("../../middlewares/validation");

router.get("/", getAllSkills);
router.get("/:id", getDetailSkill);
router.post("/", protect, isWorker, createSkillValidation, validation, createSkill);
router.delete("/:id", protect, isWorker, deleteSkill);

module.exports = router;
