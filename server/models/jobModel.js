const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },

  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],

  location: String,

  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
  },

  salary: {
    min: Number,
    max: Number,
  },

  applications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
