const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const query = { _id: req.user._id };
            const { categories } = await User.findOne(query);
            res.json(categories);
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
            const { name, type } = req.body;
            const query = { _id: req.user._id };
            const { categories } = await User.findOne(query);
            const duplicate = categories.find(category => category.name === name);
            if (duplicate) {
                res.json({ message: 'Category name already exists' });
            } else {
                const update = {
                    $push: {
                        categories: {
                            name: name,
                            type: type,
                        },
                    },
                };
                await User.updateOne(query, update, { runValidators: true });
                res.sendStatus(200);
            }
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

router.delete('/:name', async (req, res, next) => {
    try {
        if (req.user) {
            const { name } = req.params;
            const query = { _id: req.user._id };
            const { categories } = await User.findOne(query);
            const categoryExists = categories.find(category => category.name === name);
            if (categoryExists) {
                const update = {
                    $pull: { categories: { name: name } },
                };
                await User.updateOne(query, update, { runValidators: true });
                res.sendStatus(200);
            } else {
                throw Error('Could not find category to delete');
            }
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
