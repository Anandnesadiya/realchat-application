const { Server } = require('socket.io');
// const { getDb } = require('../database/config'); 
const http = require('http');
const cors = require('cors');
const global = require('../config/global');
const jwt = require('jsonwebtoken');


module.exports = function (app, server) {

    const io = require('socket.io')(8080, {
        cors: {
            origin: '*'
        }
    })

    app.use(cors({
        origin: '*'
    }))

    io.on('connection', socket => {
        if (socket.handshake.auth.token) {
            const token = socket.handshake.auth.token;
            try {
                const decoded = jwt.verify(token.split(' ')[1], 'your-secret-key');
                const isUserExist = global.socket.find(user => user.userId === decoded.userid);
                if (!isUserExist) {
                    const user = { userId: decoded.userid, socketId: socket.id, username: decoded.username };
                    global.socket.push(user);
                }
            } catch (error) {
            }
        }
        console.log('User connected', socket.id)
        console.log(global.socket);
        socket.on('addUser', userId => {
            const isUserExist = global.socket.find(user => user.userId === userId);
            if (!isUserExist) {
                const user = { userId: userId };
                global.socket.push(user);
            }
            io.emit('getUsers', global.socket);
        })
        io.emit('getUser', socket.userId);

        socket.on('sendMessage', ({ senderId, receiverId, message, conversationId }) => {
            const receiver = global.socket.find(user => user.userId === receiverId)
            // const sender = global.socket.find(user => user.userId === senderId)
            if (receiver) {
                io.to(receiver.socketId).to(socket.senderId).emit('getMessage', {
                    senderId,
                    message,
                    conversationId,
                    receiverId
                })
            }
        })

        socket.on('disconnect', (userId) => {
            console.log("disconnectd socket id ", socket.id);
            global.socket = global.socket.filter(user => user.socketId !== socket.id)
            io.emit('getUsers', global.socket);
        })
    });
    // server.listen(3000)
    global.socketio = io;
    return io;
}
