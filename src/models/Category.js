const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const CategorySchema = new Schema({
    userID: requiredString,
    name: requiredString,
    type: {
        type: String,
        required: true,
        enum: ['expenses', 'income', 'other'],
    },
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
