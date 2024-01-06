const express = require("express");
const router = express.Router();

const { getAllHires, getDetailHire, deleteHires } = require("../controllers/hire");
const { protect } = require("../middlewares/auth");

router.get("/", getAllHires);
router.get("/:id", getDetailHire);
router.delete("/:id", protect, deleteHires);

module.exports = router;
