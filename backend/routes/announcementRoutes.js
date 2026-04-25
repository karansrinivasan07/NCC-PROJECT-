const express = require('express');
const router = express.Router();
const { 
  createAnnouncement, 
  getAnnouncements, 
  deleteAnnouncement 
} = require('../controllers/announcementController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('admin', 'staff'), createAnnouncement);
router.get('/', auth, getAnnouncements);
router.delete('/:id', auth, authorize('admin', 'staff'), deleteAnnouncement);

module.exports = router;
