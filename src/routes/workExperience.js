const express = require("express");
const router = express.Router();

const { protect, isWorker } = require("../middlewares/auth");

const { getAllWorkExperiences, getDetailWorkExperience, createWorkExperience, updateWorkExperience, deleteWorkExperience } = require("../controllers/workExperience");

// validate
const { createWorkExperienceValidation, updateWorkExperienceValidation } = require("../validations/workExperience");
const validation = require("../middlewares/validation");

router.get("/", getAllWorkExperiences);
router.get("/:id", getDetailWorkExperience);
router.post("/", protect, isWorker, createWorkExperienceValidation, validation, createWorkExperience);
router.put("/:id", protect, isWorker, updateWorkExperienceValidation, validation, updateWorkExperience);
router.delete("/:id", protect, isWorker, deleteWorkExperience);

module.exports = router;
