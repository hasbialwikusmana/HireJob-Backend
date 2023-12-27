const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter");
const { protect } = require("../middlewares/auth");
const { upload, uploadBanner } = require("../middlewares/upload");

router.post("/register", recruiterController.registerRecruiter);

router.post("/login", recruiterController.login);
router.post("/refresh-token", recruiterController.refreshToken);

router.get("/", recruiterController.getAllRecruiter);

router.get("/profile", protect, recruiterController.profileRecruiter);

router.put("/profile/update-profile", protect, recruiterController.updateUserRecruiter);

router.put("/profile/update-photo", protect, upload, recruiterController.updatePhotoRecruiter);

router.put("/profile/update-banner", protect, uploadBanner, recruiterController.updateBannerRecruiter);

router.delete("/profile/delete", protect, recruiterController.deleteRecruiters);

module.exports = router;
