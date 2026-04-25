const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, authorize('admin', 'staff'), getAllUsers);

module.exports = router;
