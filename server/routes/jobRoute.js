const express = require('express')
const router = express.Router();
const { postJob } = require('../controllers/jobController')

router.post('/post-job', authUpdate, postJob)

module.exports = router;