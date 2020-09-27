const { Router } = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const { validateEmail } = require('./utils');
const PlaidAccount = require('../models/PlaidAccount');

const router = Router();

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

router.put('/:accountID', async (req, res, next) => {
    try {
        if (req.user) {
            const { accountID } = req.params;
            const { hidden } = await PlaidAccount.findById(accountID);
            const query = { id: accountID };
            const update = { hidden: !hidden };
            await PlaidAccount.updateOne(query, update);
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

module.exports = router;
