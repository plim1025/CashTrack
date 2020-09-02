const { Router } = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

const router = Router();

const validateEmail = email => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

router.get('/', (req, res, next) => {
    try {
        if (req.user) {
            res.json({ user: req.user.email });
        } else {
            res.json({ message: 'User not logged in.' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/all', async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
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
            res.json({
                error: 'There is already an account associated with this email',
            });
        } else if (!emailValid) {
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

router.delete('/all', async (req, res, next) => {
    try {
        await User.deleteMany({});
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

router.get('/', (req, res, next) => {
    try {
        res.json({ error: req.session.flash.error.slice(-1)[0] });
    } catch (error) {
        next();
    }
});

router.post(
    '/signin',
    passport.authenticate('local', {
        failureFlash: true,
    }),
    (req, res) => {
        if (req.user) {
            res.json({ email: req.user.email });
        } else {
            res.sendStatus(401);
        }
    }
);

router.post('/logout', (req, res, next) => {
    try {
        if (req.user) {
            req.logOut();
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        next();
    }
});

module.exports = router;
