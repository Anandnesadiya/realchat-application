const express = require('express');
const { sendMessage, getMessages, getConversationUsers, getUserbysearch, createNewConversation } = require('../controller/chatController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sendMessage/:receiverID', verifyToken, sendMessage);
router.get('/getMessages/:conversationID', verifyToken, getMessages);
router.get('/getConversationUsers', verifyToken, getConversationUsers);
router.get('/getuserbysearch', verifyToken, getUserbysearch);
router.get('/createNewConversation', verifyToken, createNewConversation);

module.exports = router;
