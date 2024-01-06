const express = require("express");
const router = express.Router();
const { getAllRecruiter, getRecruiterById, updateProfileRecruiter, updateImageProfile, updateBannerProfile, deleteUsers } = require("../controllers/recruiter");
const { getRecruiterHires } = require("../controllers/hire");
const { protect, isRecruiter } = require("../middlewares/auth");
const { upload, uploadBanner } = require("../middlewares/upload");
const { updateRecruiterValidation, updateImageValidation, updateBannerValidation } = require("../validations/recruiter");
const validation = require("../middlewares/validation");

router.get("/", getAllRecruiter);
router.get("/:id", getRecruiterById);
router.get("/:id_recruiter/hire", protect, isRecruiter, getRecruiterHires);
router.put("/profile/:id", protect, isRecruiter, updateRecruiterValidation, validation, updateProfileRecruiter);

router.put("/profile/update-image/:id", protect, upload, isRecruiter, updateImageValidation, validation, updateImageProfile);

router.put("/profile/update-banner/:id", protect, isRecruiter, uploadBanner, updateBannerValidation, validation, updateBannerProfile);

router.delete("/profile/delete/:id", protect, isRecruiter, deleteUsers);

module.exports = router;
