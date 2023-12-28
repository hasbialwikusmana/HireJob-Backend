const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { protect } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

router.post("/register", usersControllers.register);
router.post("/login", usersControllers.login);

// router.get("/", workerController.getAllWorker);
router.get("/profile", protect, usersControllers.getProfile);

router.get("/profile/:id", protect, usersControllers.getProfileById);

router.put("/profile/update-profile/:id", protect, usersControllers.updateProfile);

router.put("/profile/update-image/:id", protect, upload, usersControllers.updateImageProfile);

// router.delete("/profile/delete", protect, workerController.deleteWorkers);

module.exports = router;
