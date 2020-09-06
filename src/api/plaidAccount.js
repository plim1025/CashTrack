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
            console.log('Error setting account, user not logged in.');
            throw Error;
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
