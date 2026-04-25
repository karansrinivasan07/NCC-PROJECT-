const express = require('express');
const router = express.Router();
const { 
  markAttendance, 
  bulkMarkAttendance, 
  getStudentAttendance, 
  getAllAttendanceStats,
  scanAttendance
} = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('admin', 'staff'), markAttendance);
router.post('/bulk', auth, authorize('admin', 'staff'), bulkMarkAttendance);
router.post('/scan', auth, authorize('admin', 'staff'), scanAttendance);
router.get('/student/:studentId', auth, getStudentAttendance);
router.get('/student', auth, getStudentAttendance);
router.get('/stats', auth, authorize('admin', 'staff'), getAllAttendanceStats);

module.exports = router;
