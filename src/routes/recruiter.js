const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/register", recruiterController.register);
router.get("/profile", protect, recruiterController.profile);
router.put("/profile", protect, recruiterController.update);
router.put("/profile/photo", protect, upload.single("photo"), recruiterController.updateImage);

module.exports = router;
