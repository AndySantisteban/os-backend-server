// @ts-check
const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_ENCRYPT).toString(),
        isAdmin: req.body.isAdmin
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            userName: req.body.user_name,
        });

        !user &&
            res.status(401).json({
                message: 'User not found',
            });

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_ENCRYPT).toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;

        hashedPassword != inputPassword && res.status(401).json('Contraseña incorrecta');

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: '2d' }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

module.exports = router;
