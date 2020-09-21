const { Router } = require('express');
const Budget = require('../models/Budget');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const query = { userID: req.user._id };
            const budgets = await Budget.find(query);
            res.json(budgets);
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
            const { type, frequency, amount, categoryName } = req.body;
            let newBudget;
            if (frequency === 'one-time') {
                const newStartDate = new Date(req.body.startDate);
                newStartDate.setDate(newStartDate.getDate() - 1);
                const newEndDate = new Date(req.body.endDate);
                newEndDate.setDate(newEndDate.getDate() - 1);
                newBudget = new Budget({
                    userID: req.user._id,
                    type: type,
                    frequency: frequency,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    amount: amount,
                    categoryName: categoryName,
                });
            } else {
                newBudget = new Budget({
                    userID: req.user._id,
                    type: type,
                    frequency: frequency,
                    amount: amount,
                    categoryName: categoryName,
                });
            }
            await newBudget.save();
            res.json({ id: newBudget._id });
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
            const { type, frequency, amount, categoryName } = req.body;
            const query = { userID: req.user._id, _id: id };
            let update;
            if (frequency === 'one-time') {
                const newStartDate = new Date(req.body.startDate);
                newStartDate.setDate(newStartDate.getDate() - 1);
                const newEndDate = new Date(req.body.endDate);
                newEndDate.setDate(newEndDate.getDate() - 1);
                update = {
                    type: type,
                    frequency: frequency,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    amount: amount,
                    categoryName: categoryName,
                };
            } else {
                update = {
                    type: type,
                    frequency: frequency,
                    amount: amount,
                    categoryName: categoryName,
                };
            }
            await Budget.updateOne(query, update, { runValidators: true });
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

router.delete('/:id', async (req, res, next) => {
    try {
        if (req.user) {
            const { id } = req.params;
            const query = { userID: req.user._id, _id: id };
            await Budget.deleteOne(query);
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
