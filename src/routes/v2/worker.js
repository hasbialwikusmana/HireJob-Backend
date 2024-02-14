const express = require("express");
const router = express.Router();
const workerControllers = require("../controllers/worker");
const { protect, isWorker, isRecruiter } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");
const { getWorkerSkills } = require("../controllers/skill");
const { getWorkerPortfolios } = require("../controllers/portfolio");
const { getWorkerWorkExperiences } = require("../controllers/workExperience");
const { getWorkerHires, createHire } = require("../controllers/hire");
const { updateWorker, updateWorkerImage } = require("../../validations/worker");
const hireValidation = require("../../validations/hire");
const validation = require("../../middlewares/validation");

router.get("/", workerControllers.getAllWorker);
router.get("/:id", workerControllers.getWorkerById);
router.put("/profile/:id", protect, isWorker, updateWorker, validation, workerControllers.updateProfileWorker);

router.put("/profile/update-image/:id", protect, isWorker, upload, updateWorkerImage, validation, workerControllers.updateImageProfile);
router.delete("/profile/delete/:id", protect, isWorker, workerControllers.deleteUsers);

router.get("/:id_worker/skill", protect, getWorkerSkills);
router.get("/:id_worker/portfolio", protect, getWorkerPortfolios);
router.get("/:id_worker/work-experience", protect, getWorkerWorkExperiences);
router.get("/:id_worker/hire", protect, getWorkerHires);

//For recruiter
router.post("/:id_worker/hire", protect, isRecruiter, hireValidation, validation, createHire);

module.exports = router;
