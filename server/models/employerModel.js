const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  profilePic: { type: String },

  companyName: { type: String, required: true },
  
  industry: String,
  website: String,
  location: String,
  description: String,

  jobs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Job" }
  ],

  createdAt: { type: Date, default: Date.now },
});

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer
