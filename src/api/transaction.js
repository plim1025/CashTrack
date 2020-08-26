const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            res.json(user.transactions);
        } else {
            console.log('Error getting transaction, user not logged in.');
            throw Error;
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { amount, category, date } = req.body;
            const query = { _id: req.user._id };
            const update = {
                $push: {
                    transactions: {
                        amount: amount,
                        category: category,
                        date: date,
                    },
                },
            };
            await User.updateOne(query, update);
            res.sendStatus(200);
        } else {
            console.log('Error posting transaction, user not logged in.');
            throw Error;
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        if (req.user) {
            const { id } = req.params;
            const { amount, category, date } = req.body;
            const query = { _id: req.user._id, 'transactions.transactionID': id };
            const update = {
                $set: {
                    'transactions.$.amount': amount,
                    'transactions.$.category': category,
                    'transactions.$.date': date,
                },
            };
            await User.updateOne(query, update);
            res.sendStatus(200);
        } else {
            console.log('Error posting transaction, user not logged in.');
            throw Error;
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        if (req.user) {
            const { id } = req.params;
            const query = { _id: req.user._id };
            const update = {
                $pull: { transactions: { transactionID: id } },
                $push: { removedTransactionIDs: id },
            };
            await User.updateOne(query, update);
            res.sendStatus(200);
        } else {
            console.log('Error posting transaction, user not logged in.');
            throw Error;
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;
