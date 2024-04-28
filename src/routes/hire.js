const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const hireController = require("../controllers/hire");

router.get("/workers", protect, hireController.selectByWorker);
router.get("/recruiters", protect, hireController.selectByRecruiters);
router.post("/", protect, hireController.create);

module.exports = router;
