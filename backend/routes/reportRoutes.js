const express = require('express');
const router = express.Router();
const { getGroupStats, getAttendanceStats, getSummaryStats } = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.get('/group-stats', auth, authorize('admin', 'staff'), getGroupStats);
router.get('/attendance-stats', auth, authorize('admin', 'staff'), getAttendanceStats);
router.get('/summary-stats', auth, authorize('admin', 'staff'), getSummaryStats);

module.exports = router;
