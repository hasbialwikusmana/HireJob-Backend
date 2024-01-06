const express = require("express");
const router = express.Router();

const { getAllHires, getDetailHire, deleteHire } = require("../controllers/hire");
const { protect } = require("../middlewares/auth");

//Hires router
router.get("/", getAllHires);
router.get("/:id", getDetailHire);
router.delete("/:id", protect, deleteHire);

module.exports = router;
