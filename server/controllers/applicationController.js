const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/userModel");
 
const applyForJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Action Forbidden: Employers cannot apply to their own listings."
      })
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(application._id);
    await job.save();

    await User.findByIdAndUpdate(userId, {
      $push: { appliedJobs: application._id },
    });

    res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .populate("job", "title location salary")
      .sort({ createdAt: -1 });

    if (!applications.length) {
      return res.status(200).json({
        message: "No applications found",
        applications: [],
      });
    }

    res.status(200).json({
      message: "Applications loaded",
      applications,
    });
  } catch (err) {
    console.error("Fetch applications error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  applyForJob, fetchApplications
};