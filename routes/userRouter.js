const express = require("express");
const router = express.Router();
const { getdata, createUser,userlogin } = require("../controller/userController");

// const app = express();
// app.use(express.json());


router.get('/getdata', getdata);

router.post('/register', createUser);

router.post('/login', userlogin);

module.exports = router;
