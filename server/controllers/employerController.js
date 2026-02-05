const Employer = require('../models/employerModel')

const employerUpdate = async (req, res) => {
  const {
    profilePic,
    companyName,
    industry,
    website,
    location,
    description
  } = req.body

  try {
    // Find employer profile by logged-in user
    const employer = await Employer.findOne({ user: req.user._id })

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      })
    }

    // Update only provided fields
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
    console.error('Error updating employer!', err)
    res.status(500).json({
      success: false,
      message: 'Failed updating employer account'
    })
  }
}

module.exports = { employerUpdate }