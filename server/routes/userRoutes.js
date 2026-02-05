const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser, updateUser, checkUser, deleteUser } = require('../controllers/userControllers');
const authUpdate = require('../middleware/authMiddleware');
const upload = require('../middleware/multer')

router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/logout', logoutUser)
router.put('/update', authUpdate,
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]), updateUser
);
router.get('/check', authUpdate, checkUser)
router.delete('/delete/:id', authUpdate, deleteUser)

module.exports = router