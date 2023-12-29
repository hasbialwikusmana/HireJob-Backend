const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { protect, isRecruiter, isWorker } = require("../middlewares/auth");
const { upload, uploadBanner } = require("../middlewares/upload");

router.post("/register", usersControllers.register);
router.post("/login", usersControllers.login);

// router.get("/",protect,isRecruiter, workerController.getAllWorker);
router.get("/profile", protect, isRecruiter, isWorker, usersControllers.getProfile);

router.get("/profile/:id", protect, isRecruiter, isWorker, usersControllers.getProfileById);

router.put("/profile/update-profile/:id", protect, isRecruiter, isWorker, usersControllers.updateProfile);

router.put("/profile/update-image/:id", protect, isRecruiter, isWorker, upload, usersControllers.updateImageProfile);

router.put("/profile/update-banner/:id", protect, isRecruiter, uploadBanner, usersControllers.updateBannerProfile);

router.delete("/profile/delete/:id", protect, isRecruiter, isWorker, usersControllers.deleteUsers);

module.exports = router;
