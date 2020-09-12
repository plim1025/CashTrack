const { Router } = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            res.json(user.transactions);
        } else {
            throw Error('User not logged in.');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { description, amount, category, date } = req.body;
            const query = { _id: req.user._id };
            const mongooseID = mongoose.Types.ObjectId();
            const update = {
                $push: {
                    transactions: {
                        _id: mongooseID,
                        description: description,
                        amount: amount * -1,
                        category: category,
                        date: date,
                    },
                },
            };
            await User.updateOne(query, update, { runValidators: true });
            res.json(mongooseID);
        } else {
            throw Error('User not logged in.');
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
            const { description, amount, category, date } = req.body;
            const query = { _id: req.user._id, 'transactions._id': id };
            const update = {
                $set: {
                    'transactions.$.description': description,
                    'transactions.$.amount': amount * -1,
                    'transactions.$.category': category,
                    'transactions.$.date': date,
                },
            };
            await User.updateOne(query, update, { runValidators: true });
            res.sendStatus(200);
        } else {
            throw Error('User not logged in.');
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { transactionIDs } = req.body;
            const { description, amount, category, date } = req.body.transaction;
            const query = { _id: req.user._id };
            const update = {
                $set: {
                    'transactions.$[element].description': description,
                    'transactions.$[element].amount': amount * -1,
                    'transactions.$[element].category': category,
                    'transactions.$[element].date': date,
                },
            };
            const arrayFilters = {
                arrayFilters: [{ 'element._id': { $in: transactionIDs } }],
                runValidators: true,
            };
            await User.updateMany(query, update, arrayFilters);
            res.sendStatus(200);
        } else {
            throw Error('User not logged in.');
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        if (req.user) {
            const allTransactionIDs = req.body;
            const query = { _id: req.user._id };
            const { transactions } = await User.findOne(query);
            const transactionIDs = transactions
                .filter(
                    transaction =>
                        allTransactionIDs.indexOf(transaction._id.toString()) !== -1 &&
                        transaction.transactionID
                )
                .map(transaction => transaction.transactionID);
            let update;
            if (transactionIDs.length) {
                update = {
                    $pull: { transactions: { _id: { $in: allTransactionIDs } } },
                    $push: { removedTransactionIDs: { $each: transactionIDs } },
                };
            } else {
                update = {
                    $pull: { transactions: { _id: { $in: allTransactionIDs } } },
                };
            }
            await User.updateOne(query, update, { runValidators: true });
            res.sendStatus(200);
        } else {
            throw Error('User not logged in.');
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;
