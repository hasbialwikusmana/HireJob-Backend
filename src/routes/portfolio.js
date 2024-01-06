const express = require("express");
const router = express.Router();

const { upload } = require("../middlewares/upload");
const { protect, isWorker } = require("../middlewares/auth");

const { getAllPortfolios, getDetailPortfolio, createPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolio");

const { createPortfolioValidation, updatePortfolioValidation } = require("../validations/portfolio");
const validation = require("../middlewares/validation");

router.get("/", getAllPortfolios);
router.get("/:id", getDetailPortfolio);
router.post("/", protect, isWorker, upload, createPortfolioValidation, validation, createPortfolio);
router.put("/:id", protect, isWorker, upload, updatePortfolioValidation, validation, updatePortfolio);
router.delete("/:id", protect, isWorker, deletePortfolio);

module.exports = router;
