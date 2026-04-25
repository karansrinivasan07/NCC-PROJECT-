const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { register, login, getMe, getAllUsers, updateProfileImage } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');

// Multer storage config for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, authorize('admin', 'staff'), getAllUsers);
router.put('/profile-image', auth, upload.single('image'), updateProfileImage);

module.exports = router;
