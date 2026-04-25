const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  uploadMaterial, 
  getMaterials, 
  deleteMaterial 
} = require('../controllers/materialController');
const { auth, authorize } = require('../middleware/auth');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!require('fs').existsSync(dir)){
        require('fs').mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/', auth, authorize('admin', 'staff'), upload.single('file'), uploadMaterial);
router.get('/', auth, getMaterials);
router.delete('/:id', auth, authorize('admin', 'staff'), deleteMaterial);

module.exports = router;
