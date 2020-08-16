const { Router } = require('express');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.transactions);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { amount, category, date } = req.body;
        const transaction = new Transaction({
            amount: amount,
            category: category,
            date: date,
        });
        await transaction.save();
        await User.updateOne(
            { _id: req.user._id },
            { $push: { transactions: transaction } }
        );
        res.sendStatus(200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;
