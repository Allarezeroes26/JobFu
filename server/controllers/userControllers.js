const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const genToken = require('../utils/generateToken');
const cloudinary = require('../utils/cloudinary')
const streamifier = require('streamifier')

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ success: false, message: "All fields are required!" })
        
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Email not found' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password should be 8 characters or more' })
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
  const { firstName, lastName, email, address, description, skills, education } = req.body;
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
    if (skills) user.skills = skills.split(',').map(s => s.trim());
    if (education) user.education = education;

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
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(400).json({ success: false, message: 'User did not exists or unauthorized' })
        }

        res.status(200).json({ success: true, message: "User deleted!" })
    } catch (err) {
        console.log('Deleting Failed', err)
        res.status(500).json({ success: false, message: 'Deleting failed' })
    }
}

module.exports = { loginUser, registerUser, logoutUser, updateUser, checkUser, deleteUser }