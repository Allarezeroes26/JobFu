const express = require('express')
const router = express.Router();
const { postJob, deleteJob } = require('../controllers/jobController')
const authUpdate = require('../middleware/authMiddleware') 

router.post('/post-job', authUpdate, postJob)
router.delete('/delete-job', authUpdate, deleteJob)

module.exports = router;