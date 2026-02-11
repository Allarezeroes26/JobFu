const express = require("express");
const { applyForJob, fetchApplications } = require("../controllers/applicationController");
const authUpdate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", authUpdate, applyForJob);
router.get("/user-application", authUpdate, fetchApplications)

module.exports = router;