const express = require('express');
const router = express.Router();
const { 
  submitInterest, 
  getInterestReports, 
  getStudentInterests 
} = require('../controllers/interestController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('student'), submitInterest);
router.get('/reports', auth, authorize('admin', 'staff'), getInterestReports);
router.get('/my', auth, authorize('student'), getStudentInterests);

module.exports = router;
