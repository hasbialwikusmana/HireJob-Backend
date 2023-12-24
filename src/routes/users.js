const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/registerWorker", userController.registerWorker);
router.post("/registerRecruiter", userController.registerRecruiter);

router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);

router.get("/profileWorker", protect, userController.profileWorker);
router.get("/profileRecruiter", protect, userController.profileRecruiter);

router.put("/worker/profile", protect, userController.updateUserWorker);
router.put("/recruiter/profile", protect, userController.updateUserRecruiter);

router.put("/worker/photo", protect, upload, userController.updatePhotoWorker);
router.put("/recruiter/photo", protect, upload, userController.updatePhotoRecruiter);

module.exports = router;
