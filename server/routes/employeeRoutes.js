const express = require('express')
const router = express.Router()
const { createEmployer, getMyEmployer, employerUpdate } = require('../controllers/employerController')
const authUpdate = require('../middleware/authMiddleware')

router.post('/create', authUpdate, createEmployer)
router.get('/me', authUpdate, getMyEmployer)
router.put('/update', authUpdate, employerUpdate)

module.exports = router