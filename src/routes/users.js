const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { protect } = require("../middlewares/auth");

router.post("/register", usersControllers.register);
router.post("/login", usersControllers.login);
router.get("/profile", protect, usersControllers.getProfile);

module.exports = router;
