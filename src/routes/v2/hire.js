const express = require("express");
const router = express.Router();

const { getAllHires, getDetailHire, deleteHires, getRecruiterHires } = require("../controllers/hire");
const { protect, isRecruiter } = require("../../middlewares/auth");

router.get("/", getAllHires);
router.get("/:id", getDetailHire);
router.get("/worker", protect, isRecruiter, getRecruiterHires);
router.delete("/:id", protect, deleteHires);

module.exports = router;
