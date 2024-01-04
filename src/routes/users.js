const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { protect } = require("../middlewares/auth");
const { registerValidation, loginValidation } = require("../validations/users");
const validation = require("../middlewares/validation");

router.post("/register", registerValidation, validation, usersControllers.register);
router.post("/login", loginValidation, validation, usersControllers.login);
router.get("/profile", protect, usersControllers.getProfile);

module.exports = router;
