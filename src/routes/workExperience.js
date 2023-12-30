const express = require("express");
const router = express.Router();

const { protect, isWorker } = require("../middlewares/auth");

const { getAllWorkExperiences, getDetailWorkExperience, createWorkExperience, updateWorkExperience, deleteWorkExperience } = require("../controllers/workExperience");

router.get("/", protect, getAllWorkExperiences);
router.get("/:id", protect, getDetailWorkExperience);
router.post("/", protect, isWorker, createWorkExperience);
router.put("/:id", protect, isWorker, updateWorkExperience);
router.delete("/:id", protect, isWorker, deleteWorkExperience);

module.exports = router;
