const express = require("express");
const router = express.Router();
const { login, register, getProfile } = require("../controllers/users");
const { protect } = require("../../middlewares/auth");
const { registerValidation, loginValidation } = require("../../validations/users");
const validation = require("../../middlewares/validation");

router.post("/register", registerValidation, validation, register);
router.post("/login", loginValidation, validation, login);
router.get("/profile", protect, getProfile);

module.exports = router;
