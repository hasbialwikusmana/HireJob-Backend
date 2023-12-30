const express = require("express");
const router = express.Router();

const { upload } = require("../middlewares/upload");
const { protect, isWorker } = require("../middlewares/auth");

const { getAllPortfolios, getDetailPortfolio, createPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolio");

router.get("/", protect, getAllPortfolios);
router.get("/:id", protect, getDetailPortfolio);
router.post("/", protect, isWorker, upload, createPortfolio);
router.put("/:id", protect, isWorker, upload, updatePortfolio);
router.delete("/:id", protect, isWorker, deletePortfolio);

module.exports = router;
