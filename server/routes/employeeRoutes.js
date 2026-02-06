const express = require('express')
const router = express.Router()
const { createEmployer, getMyEmployer, employerUpdate } = require('../controllers/employerController')
const authUpdate = require('../middleware/authUpdate')

router.post('/employer/create', authUpdate, createEmployer)
router.get('/employer/me', authUpdate, getMyEmployer)
router.put('/employer/update', authUpdate, employerUpdate)

module.exports = router