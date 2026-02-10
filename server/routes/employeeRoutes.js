const express = require('express')
const router = express.Router()
const { createEmployer, getMyEmployer, employerUpdate, allEmployer } = require('../controllers/employerController')
const authUpdate = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')

router.post( '/create', authUpdate, upload.fields([{ name: 'profilePic', maxCount: 1 }]), createEmployer )
router.put( '/update', authUpdate, upload.fields([{ name: 'profilePic', maxCount: 1 }]), employerUpdate )
router.get('/me', authUpdate, getMyEmployer)
router.get('/all', authUpdate, allEmployer)

module.exports = router