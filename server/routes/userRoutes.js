const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser, updateUser, checkUser, deleteUser } = require('../controllers/userControllers');
const authUpdate = require('../middleware/authMiddleware');

router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)
router.put('/update', authUpdate, updateUser)
router.get('/check', authUpdate, checkUser)
router.delete('/delete/:id', authUpdate, deleteUser)

module.exports = router