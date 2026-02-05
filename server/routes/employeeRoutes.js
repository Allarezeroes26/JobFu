const express = require('express')
const router = express.Router()
const { employerUpdate } = require('../controllers/employerController')
const authUpdate = require('../middleware/authUpdate')

router.put('/employer/update', authUpdate, employerUpdate)

module.exports = router