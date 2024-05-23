const express = require('express');
const { connectToDatabase, getDb } = require('./database/config');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors')
var bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 4000;
require('dotenv').config();


app.use(cors({
    origin: '*',
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(bodyParser.json({ limit: "50mb" }));

connectToDatabase();


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


require("./core/index")(app)


