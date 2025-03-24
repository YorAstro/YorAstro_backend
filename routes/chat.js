const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat/ChatController');
const authenticate = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate.authenticate);

// Get astrologer details
router.get('/astrologer/:astrologerId', chatController.getAstrologerDetails);

// Get chat history
router.post('/history/:astrologerId', chatController.getChatHistory);

// Get active astrologers (for users)
router.get('/active-astrologers', chatController.getActiveAstrologers);

// Get active users (for astrologers)
router.get('/active-users', chatController.getActiveUsers);

module.exports = router; 