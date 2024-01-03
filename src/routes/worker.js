const express = require("express");
const router = express.Router();
const workerControllers = require("../controllers/worker");
const { protect, isWorker } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");
const { getWorkerSkills } = require("../controllers/skill");
const { getWorkerPortfolios } = require("../controllers/portfolio");
const { getWorkerWorkExperiences } = require("../controllers/workExperience");
const updateWorkerValidation = require("../validations/worker");
const validation = require("../middlewares/validation");

router.get("/", workerControllers.getAllWorker);
router.get("/:id", workerControllers.getWorkerById);
router.put("/profile/:id", protect, isWorker, updateWorkerValidation, validation, workerControllers.updateProfileWorker);

router.put("/profile/update-image/:id", protect, isWorker, upload, workerControllers.updateImageProfile);
router.delete("/profile/delete/:id", protect, isWorker, workerControllers.deleteUsers);

router.get("/:id_worker/skill", protect, getWorkerSkills);
router.get("/:id_worker/portfolio", protect, getWorkerPortfolios);
router.get("/:id_worker/work-experience", protect, getWorkerWorkExperiences);

module.exports = router;
