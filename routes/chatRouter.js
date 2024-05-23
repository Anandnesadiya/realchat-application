// routes/userRoutes.js

const express = require('express');
const { sendMessage, getMessages, getConversationUsers } = require('../controller/chatController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/sendMessage/:receiverID', verifyToken, sendMessage);

router.get('/getMessages/:conversationID', verifyToken, getMessages);

router.get('/getConversationUsers', verifyToken, getConversationUsers);

module.exports = router;
