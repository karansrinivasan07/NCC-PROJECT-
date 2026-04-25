const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;
