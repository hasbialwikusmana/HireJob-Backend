const express = require("express");
const router = express.Router();
const workerRouter = require("./worker");
const recruiterRouter = require("./recruiter");

router.use("/worker", workerRouter);
router.use("/recruiter", recruiterRouter);

module.exports = router;
