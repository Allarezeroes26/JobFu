const express = require('express')
const router = express.Router();
const { postJob, deleteJob, fetchJobs, fetchEmployerJobs, fetchJobById } = require('../controllers/jobController')
const authUpdate = require('../middleware/authMiddleware') 

router.post('/post-job', authUpdate, postJob)
router.delete('/delete-job/:id', authUpdate, deleteJob)
router.get('/all-jobs', authUpdate, fetchJobs)
router.get('/my-jobs', authUpdate, fetchEmployerJobs)
router.get('/job/:id', authUpdate, fetchJobById)

module.exports = router;