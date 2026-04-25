const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createCampEvent,
  getCampEvents,
  deleteCampEvent
} = require('../controllers/campEventController');
const { auth, authorize } = require('../middleware/auth');

// Ensure upload directory exists
const uploadDir = 'uploads/camps';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for camp event files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', auth, authorize('admin', 'staff'), upload.array('files', 10), createCampEvent);
router.get('/', auth, getCampEvents);
router.delete('/:id', auth, authorize('admin', 'staff'), deleteCampEvent);

module.exports = router;
