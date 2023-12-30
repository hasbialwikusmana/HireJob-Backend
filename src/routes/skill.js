const express = require("express");
const router = express.Router();

const { protect, isWorker } = require("../middlewares/auth");
const skillControllers = require("../controllers/skill");

//Skills router
router.get("/", skillControllers.getAllSkills);
router.get("/:id", skillControllers.getDetailSkill);
router.post("/", protect, isWorker, skillControllers.createSkill);
router.delete("/:id", protect, isWorker, skillControllers.deleteSkill);

module.exports = router;
