const express = require("express");
const app = express();
app.use(express.json());
const { getDb } = require('../database/config');
const { ObjectId } = require('mongodb');
const helper = require('../core/helper');
// const { getDb } = require('../database/config'); 

const sendMessage = (req, res) => {
    const senderID = req.userSession.userid;
    const receiverID = req.params.receiverID;
    const { message } = req.body;
    const messageID = new ObjectId().toString();
    const conversationID = new ObjectId().toString();

    if (!receiverID || !message) {
        return res.status(400).json({ error: "Fill the required fields" });
    }

    const db = getDb();

    db.collection('Conversation').findOne({ userID: { $all: [senderID, receiverID] } })
        .then(conversation => {
            if (!conversation) {
                return db.collection('Conversation').insertOne({ _id: conversationID, userID: [senderID, receiverID] });
            }
            return { insertedId: conversation._id };
        })
        .then(conversation => {
            const conversationID = conversation.insertedId;

            const messageObj = {
                _id: messageID,
                conversationID: conversationID,
                senderID: senderID,
                receiverID: receiverID,
                message: message,
                timestamp: new Date()
            };

            return db.collection('messages').insertOne(messageObj);
        })
        .then(result => {
            return res.status(200).json({ message: 'Message sent successfully', messageID: result.insertedID });
        })
        .catch(error => {
            console.error('Error sending message:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
}

const getMessages = (req, res) => {
    const userId = req.userSession.userid;
    const ConvoID = req.params.conversationID;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const db = getDb();

    db.collection('messages').find({ conversationID: ConvoID }).toArray()
        .then(messages => {
            if (!messages || messages.length === 0) {
                return res.status(404).json({ message: 'No messages found for this user' });
            }
            return res.status(200).json({ messages });
        })
        .catch(error => {
            console.error('Error getting messages:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
}

const getConversationUsers = (req, res) => {
    const userID = req.userSession.userid;

    const db = getDb();

    db.collection('Conversation').find({ userID: { $in: [userID] } }).toArray()
        .then(Conversation => {
            if (!Conversation || Conversation.length === 0) {
                return res.status(404).json({ message: 'No conversations found for this user' });
            }

            const userConversationsMap = Conversation.flatMap(conversation =>
                conversation.userID
                    .filter(id => id !== userID)
                    .map(otherUserID => ({ userID: otherUserID, conversationID: conversation._id }))
            );

            const otherUserIDs = userConversationsMap.map(uc => uc.userID);

            return db.collection('users').find({ _id: { $in: otherUserIDs } }).toArray()
                .then(users => ({ users, userConversationsMap }));
        })
        .then(({ users, userConversationsMap }) => {
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }

            const userConversations = users.map(user => {
                const conversation = userConversationsMap.find(uc => uc.userID === user._id);
                return {
                    user,
                    conversationID: conversation.conversationID
                };
            });
            return res.status(200).json({ userConversations });
        })
        .catch(error => {
            console.error('Error getting conversation users:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
};



module.exports = { sendMessage, getMessages, getConversationUsers }