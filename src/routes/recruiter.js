const express = require("express");
const router = express.Router();
const recruiterControllers = require("../controllers/recruiter");
const { protect, isRecruiter } = require("../middlewares/auth");
const { upload, uploadBanner } = require("../middlewares/upload");

router.get("/", protect, recruiterControllers.getAllRecruiter);
router.get("/:id", protect, isRecruiter, recruiterControllers.getRecruiterById);
router.put("/profile/:id", protect, isRecruiter, recruiterControllers.updateProfileRecruiter);

router.put("/profile/update-image/:id", protect, upload, isRecruiter, recruiterControllers.updateImageProfile);

router.put("/profile/update-banner/:id", protect, isRecruiter, uploadBanner, recruiterControllers.updateBannerProfile);

router.delete("/profile/delete/:id", protect, isRecruiter, recruiterControllers.deleteUsers);

module.exports = router;
