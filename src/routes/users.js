const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { protect, isRecruiter } = require("../middlewares/auth");
const { upload, uploadBanner } = require("../middlewares/upload");

router.post("/register", usersControllers.register);
router.post("/login", usersControllers.login);

// router.get("/",protect,isRecruiter, workerController.getAllWorker);
router.get("/profile", protect, usersControllers.getProfile);

router.get("/profile/:id", protect, usersControllers.getProfileById);

router.put("/profile/update-profile/:id", protect, usersControllers.updateProfile);

router.put("/profile/update-image/:id", protect, upload, usersControllers.updateImageProfile);

router.put("/profile/update-banner/:id", protect, isRecruiter, uploadBanner, usersControllers.updateBannerProfile);

router.delete("/profile/delete/:id", protect, usersControllers.deleteUsers);

module.exports = router;
