const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["seeker", "employer"],
    default: "seeker",
  },

  skills: [String],
  resume: String,

  appliedJobs: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Application" }
  ],

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
