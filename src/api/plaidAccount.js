const { Router } = require('express');
const User = require('../models/User');
const PlaidAccount = require('../models/PlaidAccount');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { accountIDs } = await User.findById(req.user._id);
            const query = { id: { $in: accountIDs } };
            const accounts = await PlaidAccount.find(query);
            res.json(accounts);
        } else {
            throw Error('User not logged in.');
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
