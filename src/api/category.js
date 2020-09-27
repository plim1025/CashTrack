const { Router } = require('express');
const Category = require('../models/Category');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const query = { userID: req.user._id };
            const categories = await Category.find(query);
            res.json(categories);
        } else {
            throw Error('User not logged in');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if (req.user) {
            const { name, type } = req.body;
            const query = { userID: req.user._id };
            const categories = await Category.find(query);
            // eslint-disable-next-line prettier/prettier
            const duplicate = [
                ...(categories || []),
                { name: 'Bank Fees', type: 'expenses' },
                { name: 'Legal Fees', type: 'expenses' },
                { name: 'Charitable Giving', type: 'expenses' },
                { name: 'Medical', type: 'expenses' },
                { name: 'Cash', type: 'expenses' },
                { name: 'Check', type: 'expenses' },
                { name: 'Education', type: 'expenses' },
                { name: 'Membership Fee', type: 'expenses' },
                { name: 'Service', type: 'expenses' },
                { name: 'Utilities', type: 'expenses' },
                { name: 'Postage/Shipping', type: 'expenses' },
                { name: 'Restaurant', type: 'expenses' },
                { name: 'Entertainment', type: 'expenses' },
                { name: 'Loan', type: 'expenses' },
                { name: 'Rent', type: 'expenses' },
                { name: 'Home Maintenance/Improvement', type: 'expenses' },
                { name: 'Automotive', type: 'expenses' },
                { name: 'Electronic', type: 'expenses' },
                { name: 'Insurance', type: 'expenses' },
                { name: 'Business Expenditure', type: 'expenses' },
                { name: 'Real Estate', type: 'expenses' },
                { name: 'Personal Care', type: 'expenses' },
                { name: 'Gas', type: 'expenses' },
                { name: 'Subscription', type: 'expenses' },
                { name: 'Travel', type: 'expenses' },
                { name: 'Shopping', type: 'expenses' },
                { name: 'Clothing', type: 'expenses' },
                { name: 'Groceries', type: 'expenses' },
                { name: 'Tax', type: 'expenses' },
                { name: 'Subsidy', type: 'income' },
                { name: 'Interest', type: 'income' },
                { name: 'Deposit', type: 'income' },
                { name: 'Payroll/Salary', type: 'income' },
                { name: 'Cash', type: 'income' },
                { name: 'Transfer', type: 'other' },
                { name: 'Uncategorized', type: 'other' },
            ].find(category => category.name === name);
            if (duplicate) {
                res.json({ message: 'Category name already exists' });
            } else {
                const newCategory = new Category({
                    userID: req.user._id,
                    name: name,
                    type: type,
                });
                await newCategory.save();
                res.json(newCategory);
            }
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

router.put('/:id', async (req, res, next) => {
    try {
        if (req.user) {
            const { id } = req.params;
            const { name, type } = req.body;
            const query = { userID: req.user._id, _id: id };
            const update = { name: name, type: type };
            await Category.updateOne(query, update, { runValidators: true });
            const updatedCategory = await Category.findOne(query);
            res.json(updatedCategory);
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

router.delete('/:id', async (req, res, next) => {
    try {
        if (req.user) {
            const { id } = req.params;
            const query = { userID: req.user._id, _id: id };
            await Category.deleteOne(query);
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
