const Job = require('../models/jobModel');
const Employer = require('../models/employerModel');

const postJob = async (req, res) => {

    const { title, description, requirements, category, location, jobType, salary } = req.body;

  try {
    const userId = req.user._id;

    const employer = await Employer.findOne({ user: userId });
    if (!employer) {
      return res.status(403).json({
        success: false,
        message: "You must create an employer profile before posting jobs."
      });
    }

    const job = await Job.create({
      employer: employer._id,
      title,
      description,
      requirements,
      category,
      location,
      jobType,
      salary
    });

    employer.jobs.push(job._id);
    await employer.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job
    });

  } catch (err) {
    console.error("Job creation failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create job"
    });
  }
};

module.exports = { postJob };