const { Router } = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const { validateEmail } = require('./utils');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            res.json(user);
        } else {
            throw Error('User not logged in');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const duplicateUser = await User.findOne({ email: email });
        const emailValid = validateEmail(email);
        if (duplicateUser) {
            res.status(401);
            res.json({
                error: 'There is already an account associated with this email',
            });
        } else if (!emailValid) {
            res.status(401);
            res.json({ error: 'Invalid email' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email: email,
                password: hashedPassword,
            });
            await user.save();
            res.json({ email: email });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.post('/signin', passport.authenticate('local'), (req, res, next) => {
    try {
        if (req.user) {
            res.json({ email: req.user.email });
        } else {
            res.sendStatus(401);
            throw Error('Error signing in');
        }
    } catch (error) {
        next();
    }
});

router.post('/logout', (req, res, next) => {
    try {
        if (req.user) {
            req.logOut();
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
            throw Error('Error logging out');
        }
    } catch (error) {
        next();
    }
});

router.put('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { notification, theme } = req.body;
            const query = { _id: req.user._id };
            const update = { notification: notification, theme: theme };
            await User.updateOne(query, update);
            res.sendStatus(200);
        } else {
            throw Error('User not logged in');
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.post('/password', async (req, res, next) => {
    try {
        if (req.user) {
            const { password } = req.body;
            const currentUser = await User.findById(req.user._id);
            if (await bcrypt.compare(password, currentUser.password)) {
                res.json(true);
            } else {
                res.status(400);
                res.json(false);
            }
        } else {
            throw Error('User not logged in');
        }
    } catch (error) {
        next(error);
    }
});

router.put('/password', async (req, res, next) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let query;
        if (req.user) {
            query = { _id: req.user._id };
        } else {
            query = { _id: req.body.id };
        }
        const update = { password: hashedPassword };
        await User.updateOne(query, update);
        res.sendStatus(200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.post('/forgotPassword/:email', async (req, res, next) => {
    try {
        const { email } = req.params;
        const query = { email: email };
        const user = await User.findOne(query);
        if (user) {
            const mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cashtrackapp78@gmail.com',
                    pass: 'PYLGY278',
                },
            });
            await mailTransporter.sendMail({
                from: 'cashtrackapp78@gmail.com',
                to: email,
                subject: 'Password Reset',
                html: `<p>Click the link below to reset your CashTrack password.</p><br/><p>${process.env.FRONTEND_URI}/resetpassword/${user._id}</p>`,
            });
        }
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
