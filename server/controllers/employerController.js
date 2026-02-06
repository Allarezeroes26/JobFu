const Employer = require('../models/employerModel')
const User = require('../models/userModel')

const createEmployer = async (req, res) => {
  try {
    const userId = req.user._id

    const existingEmployer = await Employer.findOne({ user: userId })
    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: 'Employer profile already exists'
      })
    }

    const {
      profilePic,
      companyName,
      industry,
      website,
      location,
      description
    } = req.body

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      })
    }

    const employer = await Employer.create({ user: userId, profilePic, companyName, industry, website, location, description })

    await User.findByIdAndUpdate(userId, { role: 'employer' })

    res.status(201).json({
      success: true,
      message: 'Employer profile created successfully',
      employer
    })

  } catch (err) {
    console.error('Error creating employer profile:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to create employer profile'
    })
  }
}

const getMyEmployer = async (req, res) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id })

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      })
    }

    res.status(200).json({
      success: true,
      employer
    })

  } catch (err) {
    console.error('Error fetching employer profile:', err)
    res.status(500).json({
      success: false,
      message: 'Failed fetching employer profile'
    })
  }
}

const employerUpdate = async (req, res) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id })

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      })
    }

    const {
      profilePic,
      companyName,
      industry,
      website,
      location,
      description
    } = req.body

    if (profilePic !== undefined) employer.profilePic = profilePic
    if (companyName !== undefined) employer.companyName = companyName
    if (industry !== undefined) employer.industry = industry
    if (website !== undefined) employer.website = website
    if (location !== undefined) employer.location = location
    if (description !== undefined) employer.description = description

    const updatedEmployer = await employer.save()

    res.status(200).json({
      success: true,
      message: 'Employer profile updated successfully',
      employer: updatedEmployer
    })

  } catch (err) {
    console.error('Error updating employer profile:', err)
    res.status(500).json({
      success: false,
      message: 'Failed updating employer profile'
    })
  }
}

module.exports = {
  createEmployer,
  getMyEmployer,
  employerUpdate
}