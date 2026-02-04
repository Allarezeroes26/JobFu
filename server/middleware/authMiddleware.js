const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authUpdate = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' })

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ success: false, message: "Token not valid" })

        const user = await User.findById( decoded.userId ).select('-password')
        if (!user) return res.status(401).json({ success: false, message: "User not Found" })

        req.user = user
        next()

    } catch (err) {
        console.log('Error validating token', err)
        res.status(500).json({ success: false, message: "Error validating token" })
    }
}

module.exports = authUpdate