const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  profilePic: { type: String },
  description: { type: String },
  education: { type: String },
  links: [String],
  role: {
    type: String,
    enum: ["seeker", "employer"],
    default: "seeker",
  },
  skills: [String],
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      desc: String
    }
  ],
  projects: [
    {
      name: String,
      link: String,
      desc: String
    }
  ],

  resume: { type: String },
  resumeName: { type: String },
  appliedJobs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
  ],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("findOneAndDelete", async function () {
  try {
    const userId = this.getQuery()._id;

    const Job = require("./jobModel");
    const Application = require("./applicationModel");
    const User = require("./userModel");

    const user = await User.findById(userId);
    if (!user) return;

    if (user.role === "employer") {
      const jobs = await Job.find({ employer: userId });
      const jobIds = jobs.map(job => job._id);

      await Application.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ employer: userId });
    }

    if (user.role === "seeker") {
      const applications = await Application.find({ applicant: userId });
      const applicationIds = applications.map(app => app._id);

      await Job.updateMany(
        { applications: { $in: applicationIds } },
        { $pull: { applications: { $in: applicationIds } } }
      );

      await Application.deleteMany({ applicant: userId });
    }

  } catch (err) {
    console.error("Cascade delete error:", err);
    throw err;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
