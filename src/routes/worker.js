const express = require("express");
const router = express.Router();
const workerController = require("../controllers/worker");
const { protect } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

router.post("/register", workerController.registerWorker);
router.post("/login", workerController.login);
router.post("/refresh-token", workerController.refreshToken);

router.get("/", workerController.getAllWorker);
router.get("/profile", protect, workerController.profileWorker);

router.put("/profile/update-profile", protect, workerController.updateUserWorker);

router.put("/profile/update-photo", protect, upload, workerController.updatePhotoWorker);

router.delete("/profile/delete", protect, workerController.deleteWorkers);

module.exports = router;
