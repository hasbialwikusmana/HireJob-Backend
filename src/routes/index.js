const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
// const workerRouter = require("./worker");
// const recruiterRouter = require("./recruiter");
// const skillRouter = require("./skill");
// const portfolioController = require("./portfolio");
// const workExperienceController = require("./workExperience");

router.use("/", usersRouter);
// router.use("/worker", workerRouter);
// router.use("/recruiter", recruiterRouter);
// router.use("/skill", skillRouter);
// router.use("/portfolio", portfolioController);
// router.use("/work-experience", workExperienceController);

module.exports = router;
