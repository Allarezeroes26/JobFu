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

  category: { type: String },

  location: String,

  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
  },

  salary: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
  },

  status: {
    type: String,
    enum: ["open", "closed", "paused"],
    default: "open"
  },

  applications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);