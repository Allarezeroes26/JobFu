const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const genToken = require('../utils/generateToken');
const cloudinary = require('../utils/cloudinary')
const streamifier = require('streamifier')
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const Employer = require("../models/employerModel")

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ success: false, message: "All fields are required!" })
        
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email not found' })
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if (!matchPassword) {
            return res.status(401).json({ success: false, message: "Password didn't match!" })
        }

        genToken(user._id, res);
        res.status(200).json({ success: true, message: 'Successfully logged in' ,user })
        
    } catch (err) {
        console.log('Error Login', err)
        res.status(500).json({ success: false, message: 'Login failed' })
    }
}
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if (!firstName || !lastName || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required!' })

        if (password.length < 8) return res.status(400).json({ success: false, message: "Password should be 8 characters or longer!" })
        
        const user = await User.findOne({ email })

        if (user) return res.status(409).json({ success: false, message: 'Email already exists' })
        
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            genToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({ success: true, message: 'Account Successfully Created', newUser })
        }

    } catch (err) {
        console.log('Failed Register', err);
        res.status(500).json({ success: false, message: 'Register failed' })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0})
        res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (err) {
        console.log('Failed Logout!')
        res.status(500).json({ success: false, message: 'Failed to logout' })
    }
}

const uploadToCloudinary = (buffer, folder, resource_type = 'image', originalName) => {
  return new Promise((resolve, reject) => {
    let finalPublicId = undefined;
    if (originalName) {
      finalPublicId = (resource_type === 'raw') 
        ? originalName 
        : originalName.replace(/\.[^/.]+$/, "");
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        overwrite: true,
        public_id: finalPublicId,
        use_filename: true,
        unique_filename: false
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const updateUser = async (req, res) => {
  const { firstName, lastName, email, address, description, skills, education, links, experience, projects } = req.body;
  const profilePicFile = req.files?.profilePic?.[0];
  const resumeFile = req.files?.resume?.[0];

  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: "User doesn't exist" });
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (address) user.address = address;
    if (description) user.description = description;
    if (education) user.education = education;
    if (links) user.links = links ;
    if (skills) {
      user.skills = skills.split(',').map(s => s.trim());
    }
    if (experience) {
      try {
        user.experience = JSON.parse(experience);
      } catch (e) {
        console.error("Experience parse error:", e);
      }
    }

    if (projects) {
      try {
        user.projects = JSON.parse(projects);
      } catch (e) {
        console.error("Projects parse error:", e);
      }
    }

    if (profilePicFile) {
      const result = await uploadToCloudinary(profilePicFile.buffer, 'profile_pics', 'image');
      user.profilePic = result.secure_url;
    }

    if (resumeFile) {
      const path = require('path');
      const fileExt = path.extname(resumeFile.originalname);
      
      const sanitizeFileName = (name) => {
        const base = name.replace(/\.[^/.]+$/, "");
        const cleanBase = base.replace(/[^a-zA-Z0-9-_]/g, "_").substring(0, 50);
        return cleanBase + fileExt; 
      };

      const publicIdWithExt = sanitizeFileName(resumeFile.originalname);

      const result = await uploadToCloudinary(
        resumeFile.buffer,
        'resume',
        'raw',
        publicIdWithExt
      );

      user.resume = result.secure_url;
      user.resumeName = resumeFile.originalname;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User Updated Successfully',
      user: updatedUser
    });
  } catch (err) {
    console.log('Update Failed!', err);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

const checkUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(400).json({ success: false, message: 'Not Authorized' })
        }

        res.status(200).json(req.user)
    } catch (err) {
        console.log('Checking failed', err)
        res.status(500).json({ success: false, message: 'Checking failed!' })
    }
}


const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Deleting user:", user._id, "Role:", user.role);

    if (user.role === "employer") {
      const employer = await Employer.findOne({ user: userId });
      if (employer) {
        const jobs = await Job.find({ employer: employer._id });
        const jobIds = jobs.map(job => job._id);
        const appDel = await Application.deleteMany({ job: { $in: jobIds } });
        const jobDel = await Job.deleteMany({ _id: { $in: jobIds } });

        await Employer.findByIdAndDelete(employer._id);
      }
    }

    if (user.role === "seeker") {
      const applications = await Application.find({ applicant: userId });
      const appIds = applications.map(app => app._id);
      const jobUpdate = await Job.updateMany(
        { applications: { $in: appIds } },
        { $pull: { applications: { $in: appIds } } }
      );
      const appDel = await Application.deleteMany({ applicant: userId });
    }

    await User.findByIdAndDelete(userId);
    console.log("Deleted user account");

    res.status(200).json({
      success: true,
      message: "User and all related data deleted successfully"
    });

  } catch (err) {
    console.error("Deleting Failed", err);
    res.status(500).json({ success: false, message: "Deleting failed" });
  }
};

module.exports = { loginUser, registerUser, logoutUser, updateUser, checkUser, deleteUser }