const express = require("express");
const { applyForJob } = require("../controllers/applicationController");
const authUpdate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", authUpdate, applyForJob);

module.exports = router;