const express = require("express");
const { applyForJob, fetchApplications, updateStatus } = require("../controllers/applicationController");
const authUpdate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", authUpdate, applyForJob);
router.get("/user-application", authUpdate, fetchApplications)
router.put("/status/:id", authUpdate, updateStatus)

module.exports = router;