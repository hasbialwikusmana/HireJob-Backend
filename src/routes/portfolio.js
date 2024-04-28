const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const portfolioController = require("../controllers/portfolio");
const upload = require("../middlewares/upload");

router.get("/", protect, portfolioController.selectAll);
router.get("/:id", portfolioController.selectByWorker);
router.post("/", protect, upload.single("image"), portfolioController.create);
router.delete("/:id", protect, portfolioController.drop);
router.put("/:id", protect, upload.single("image"), portfolioController.update);

module.exports = router;
