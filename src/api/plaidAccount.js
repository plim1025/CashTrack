const { Router } = require('express');
const PlaidAccount = require('../models/PlaidAccount');
const Transaction = require('../models/Transaction');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const query = { userID: req.user._id };
            const accounts = await PlaidAccount.find(query);
            res.json(accounts);
        } else {
            throw Error('User not logged in');
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        if (req.user) {
            const { name, hidden } = req.body;
            const { id } = req.params;
            const query = { userID: req.user._id, id: id };
            const update = { name: name, hidden: hidden };
            await PlaidAccount.updateOne(query, update, { runValidators: true });
            const newAccount = await PlaidAccount.findOne(query);
            res.json(newAccount);
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

router.delete('/:batchID', async (req, res, next) => {
    try {
        if (req.user) {
            const { batchID } = req.params;
            const plaidAccountQuery = { batchID: batchID };
            const deletedPlaidAccounts = await PlaidAccount.find(plaidAccountQuery);
            const deletedPlaidAccountIDs = deletedPlaidAccounts.map(account => account.id);
            await PlaidAccount.deleteMany(plaidAccountQuery);

            const transactionQuery = { accountID: { $in: deletedPlaidAccountIDs } };
            await Transaction.deleteMany(transactionQuery);
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
