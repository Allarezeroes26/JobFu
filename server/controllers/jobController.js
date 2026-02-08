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

    if (!employer.jobs) employer.jobs = []
    employer.jobs.push(job._id)
    await employer.save()


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

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findByIdAndDelete(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    })

  } catch (err) {
    console.error('Failed to delete job:', err)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

const fetchJobs = async (req, res) => {
  try {
    const jobs = await Job.find({})
    res.status(200).json({ success: true, message: "Fetched All Jobs", jobs })
  } catch (err) {
    console.log('Error: ', err)
    res.status(500).json({ success: false, message: 'Error fetching jobs' })
  }
}

const fetchEmployerJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const employer = await Employer.findOne({ user: userId });

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found"
      })
    }

    const jobs = await Job.find({ employer: employer._id }).sort({ createdAt: -1 })

    res.status(200).json({ success: true, message: "Fetched your jobs", jobs })
  } catch (err) {
    console.log('Error fetching employer jobs: ', err)
    res.status(500).json({
      success: false, message: "Failed to fetch jobs"
    })
  }
}

const fetchJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    res.status(200).json({
      success: true, job
    })
  } catch (err) {
    console.log('Error getting Job', err)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    })
  }
}

module.exports = { postJob, deleteJob, fetchJobs, fetchEmployerJobs, fetchJobById };