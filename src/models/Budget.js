const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const BudgetSchema = new Schema({
    userID: requiredString,
    frequency: {
        type: String,
        required: true,
        enum: ['year', 'month', 'week', 'day', 'one-time'],
    },
    startDate: Date,
    endDate: Date,
    amount: {
        type: Number,
        required: true,
    },
    categoryName: requiredString,
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
