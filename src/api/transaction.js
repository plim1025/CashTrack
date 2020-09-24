const { Router } = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const query = { userID: req.user._id };
            const transactions = await Transaction.find(query);
            res.json(transactions);
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
            const newCategory = new Transaction({
                userID: req.user._id,
                description: description,
                amount: amount,
                category: category,
                date: date,
                selected: true,
            });
            await newCategory.save();
            res.json(newCategory);
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
            let update;
            if (!req.body.transaction) {
                update = { category: 'Uncategorized' };
            } else if (
                req.body.transaction.description &&
                req.body.transaction.amount &&
                req.body.transaction.category &&
                req.body.transaction.date
            ) {
                const { description, amount, category, date } = req.body.transaction;
                update = {
                    description: description,
                    amount: amount,
                    category: category,
                    date: date,
                };
            } else {
                update = { category: req.body.transaction.category };
            }
            const query = { userID: req.user._id, _id: { $in: transactionIDs } };
            await Transaction.updateMany(query, update, { runValidators: true });
            const updatedTransactions = await Transaction.find(query);
            res.json(updatedTransactions);
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
            const { transactionIDs } = req.body;
            const deletionQuery = { userID: req.user._id, _id: { $in: transactionIDs } };
            await Transaction.deleteMany(deletionQuery);

            const appendingQuery = { _id: req.user._id };
            const appendingUpdate = {
                $push: { removedTransactionIDs: { $each: transactionIDs } },
            };
            await User.updateOne(appendingQuery, appendingUpdate, { runValidators: true });
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
