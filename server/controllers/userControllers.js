const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const genToken = require('../utils/generateToken');

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

const updateUser = async () => {
}

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