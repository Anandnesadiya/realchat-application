const express = require('express');
const { connectToDatabase, getDb } = require('./database/config');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Correctly initialize socket.io with the server

const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: '*',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(bodyParser.json({ limit: "50mb" }));

connectToDatabase();

io.on("connection", (socket) => {
    console.log("user connected");
    // Add your socket event handlers here
});

let _server =server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

require("./core/index")(app,_server);
