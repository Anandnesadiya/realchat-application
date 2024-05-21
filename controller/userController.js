const express = require("express");
const app = express();
app.use(express.json());
const { getDb } = require('../database/config');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const helper = require('../core/helper');


const getdata = async (req, res) => {
    try {
        const db = getDb();

        const data = await db.collection('users').find().toArray();

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createUser = (req, res) => {
    const { UserName, Email, Password, PhoneNumber } = req.body;
    const userId = new ObjectId();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    

    if (!UserName || !Email || !Password || !PhoneNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!emailRegex.test(Email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!phoneRegex.test(PhoneNumber)) {
        return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    const db = getDb();

    db.collection('users').countDocuments({ Email })
        .then(emailCount => {
            if (emailCount > 0) {
                return Promise.reject({ error: 'Email already exists' });
            }

            return db.collection('users').insertOne({ _id: userId, UserName, Email, Password, PhoneNumber });
        })
        .then(() => {
            return res.status(200).json({ message: 'User added successfully!', userId });
        })
        .catch(error => {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        });
};

const userlogin = (req, res) => {
    const { Password, Email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(Email)) {
        return Promise.reject(2002)
    }

    const db = getDb();

    db.collection('users').findOne({ Email })
        .then(user => {
            if (!user) {
                return Promise.reject(2002);
            }

            if (user.Password !== Password) {
                return Promise.reject(2003);
            }
            const token = jwt.sign({ email: Email, userid: user._id }, 'your-secret-key');
            return { accesstoken: token };
        })
        .then(token => {
            return res.status(200).json({ success: true, token });
        })
        .catch(err => {
            helper.error(res, err);
        });
};


module.exports = { getdata, createUser, userlogin }