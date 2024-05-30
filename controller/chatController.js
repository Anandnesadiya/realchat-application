const express = require("express");
const app = express();
app.use(express.json());
const { getDb } = require('../database/config');
const { ObjectId } = require('mongodb');
const helper = require('../core/helper');
const message = require("../core/message");
const global = require('../config/global');
const socket = require('../core/socket')

// const socketIo = require('socket.io');
// // const { getDb } = require('../database/config'); 
// const http = require('http');
// const server = http.createServer(app);
// const io = socketIo(server); // Correctly initialize socket.io with the server
// const cors = require('cors');

// app.use(cors({
//     origin: 'http://localhost:3000',
// }));


// let users = []
// io.on('connection',socket=>{
//     console.log('User connected',socket.id)
//     socket.on('addUser',userId =>{
//         const user = {userId:userId,socketId:socket.id};
//         users.push(user);
//         io.emit('getUsers',users);
//     })
//     io.emit('getUser',socket.userId);
// })



const sendMessage = (req, res) => {
    const senderID = req.userSession.userid;
    const receiverID = req.params.receiverID;
    const { message } = req.body;
    const messageID = new ObjectId().toString();
    const conversationID = new ObjectId().toString();
    const conversationSeenTime = new Date();

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
        .then(() => {
            let userSocketId = global.socket.find((i) => i.userId == receiverID);
            if (userSocketId) {
                global.socketio.to(userSocketId.socketId).emit('getMessage');
            }
            return Promise.resolve();
        })  
        .then(result => {
            return res.status(200).json({ message: 'Message sent successfully', messageID: '' ,conversationID});
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
    if (ConvoID != '0') {
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
    else {
        db.collection('messages').find({ conversationID: ConvoID }).toArray()
            .then(messages => {
                return res.status(200).json({ messages });
            })
    }
}

const getConversationUsers = async (req, res) => {
    const userID = req.userSession.userid;

    const db = getDb();

    db.collection('Conversation').find({ userID: { $in: [userID] } }).toArray()
        .then(Conversation => {
            // if (!Conversation || Conversation.length === 0) {
            //     return res.status(404).json({ message: 'No conversations found for this user' });
            // }

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
            // if (!users || users.length === 0) {
            //     return res.status(404).json([{ message: 'No users found' }]);
            // }

            const userConversations = users.map(user => {
                const conversation = userConversationsMap.find(uc => uc.userID === user._id);
                return {
                    user,
                    conversationID: conversation.conversationID
                };
            });
            if (userConversations) {
                return res.status(200).json({ userConversations });
            }
            else {
                return res.status(200).json({});
            }
        })
        .catch(error => {
            console.error('Error getting conversation users:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
};

const getUserbysearch = async (req, res) => {
    try {
        const db = getDb();
        const User = db.collection('users');
        const Conversation = db.collection('Conversation');
        const userID = req.userSession.userid;

        if (!userID) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const query = {};
        if (req.query.PhoneNumber) {
            query.PhoneNumber = { $regex: req.query.PhoneNumber, $options: 'i' };
        }

        const users = await User.find(query).toArray();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        const userIDs = users.map(user => user._id);
        const conversations = await Conversation.find({ userID: userID }).toArray();

        const userConversations = await Promise.all(users.map(async (user) => {
            const conversation = await Conversation.findOne({ userID: { $all: [userID, user._id] } });
            return {
                user,
                conversationID: conversation ? conversation._id.toString() : "0"
            };
        }));

        res.status(200).json({ userConversations });
    } catch (error) {
        console.error('Error fetching users with conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createNewConversation = (req, res) => {
    const senderID = req.userSession.userid;
    const receiverID = req.query.receiverID;
    const db = getDb();

    if (receiverID) {
        const conversationID = new ObjectId().toString(); // Convert to string
        db.collection('Conversation').insertOne({ _id: conversationID, userID: [senderID, receiverID] }) // Use new ObjectId() for _id
            .then((result) => {
                return res.status(201).json({ message: 'Conversation created successfully', conversationID });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ message: 'Error creating conversation' });
            });
    } else {
        return res.status(400).json({ message: 'Receiver ID is required' });
    }
};

module.exports = { sendMessage, getMessages, getConversationUsers, getUserbysearch, createNewConversation }