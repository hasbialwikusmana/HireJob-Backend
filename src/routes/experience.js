const express = require("express");
const experienceController = require("../controllers/experience");
const { protect } = require("../middlewares/auth");
const router = express.Router();
router.post("/", protect, experienceController.create);
router.get("/", protect, experienceController.selectAll);
router.get("/:id", experienceController.selectByWorker);
router.delete("/:id", protect, experienceController.drop);
router.put("/:id", protect, experienceController.update);

module.exports = router;
