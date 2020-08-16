const { Router } = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

const router = Router();

const validateEmail = email => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

router.get('/', (req, res, next) => {
    try {
        if (req.user) {
            res.json({ user: req.user });
        } else {
            res.json({ user: null });
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
            res.sendStatus(200);
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

module.exports = router;
