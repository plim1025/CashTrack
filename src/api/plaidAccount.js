const { Router } = require('express');
const PlaidAccount = require('../models/PlaidAccount');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const query = { userID: req.user._id };
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
