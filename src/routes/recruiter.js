const express = require("express");
const router = express.Router();
const recruiterControllers = require("../controllers/recruiter");
const { protect, isRecruiter } = require("../middlewares/auth");
const { upload, uploadBanner } = require("../middlewares/upload");
const { updateRecruiterValidation, updateImageValidation, updateBannerValidation } = require("../validations/recruiter");
const validation = require("../middlewares/validation");

router.get("/", recruiterControllers.getAllRecruiter);
router.get("/:id", recruiterControllers.getRecruiterById);
router.put("/profile/:id", protect, isRecruiter, updateRecruiterValidation, validation, recruiterControllers.updateProfileRecruiter);

router.put("/profile/update-image/:id", protect, upload, isRecruiter, updateImageValidation, validation, recruiterControllers.updateImageProfile);

router.put("/profile/update-banner/:id", protect, isRecruiter, uploadBanner, updateBannerValidation, validation, recruiterControllers.updateBannerProfile);

router.delete("/profile/delete/:id", protect, isRecruiter, recruiterControllers.deleteUsers);

module.exports = router;
