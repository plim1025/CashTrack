const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const requiredNumber = {
    type: Number,
    required: true,
};

const UserSchema = new Schema({
    email: requiredString,
    password: requiredString,
    accessToken: String,
    itemID: String,
    accountIDs: {
        type: [String],
        default: [],
    },
    transactions: {
        type: [
            {
                transactionID: String,
                accountID: String,
                categoryID: String,
                description: requiredString,
                amount: requiredNumber,
                category: requiredString,
                merchant: String,
                date: {
                    type: Date,
                    required: true,
                },
            },
        ],
        default: [],
    },
    removedTransactionIDs: {
        type: [String],
        default: [],
    },
    categories: {
        type: [
            {
                name: requiredString,
                type: {
                    type: String,
                    required: true,
                    enum: ['expense', 'income', 'other'],
                },
            },
        ],
        default: [
            { name: 'Bank Fees', type: 'expense' },
            { name: 'Legal Fees', type: 'expense' },
            { name: 'Charitable Giving', type: 'expense' },
            { name: 'Medical', type: 'expense' },
            { name: 'Cash', type: 'expense' },
            { name: 'Check', type: 'expense' },
            { name: 'Education', type: 'expense' },
            { name: 'Membership Fee', type: 'expense' },
            { name: 'Service', type: 'expense' },
            { name: 'Utilities', type: 'expense' },
            { name: 'Postage/Shipping', type: 'expense' },
            { name: 'Restaurant', type: 'expense' },
            { name: 'Entertainment', type: 'expense' },
            { name: 'Loan', type: 'expense' },
            { name: 'Rent', type: 'expense' },
            { name: 'Home Maintenance/Improvement', type: 'expense' },
            { name: 'Automotive', type: 'expense' },
            { name: 'Electronic', type: 'expense' },
            { name: 'Insurance', type: 'expense' },
            { name: 'Business Expenditure', type: 'expense' },
            { name: 'Real Estate', type: 'expense' },
            { name: 'Personal Care', type: 'expense' },
            { name: 'Gas', type: 'expense' },
            { name: 'Subscription', type: 'expense' },
            { name: 'Travel', type: 'expense' },
            { name: 'Shopping', type: 'expense' },
            { name: 'Clothing', type: 'expense' },
            { name: 'Groceries', type: 'expense' },
            { name: 'Tax', type: 'expense' },
            { name: 'Subsidy', type: 'income' },
            { name: 'Interest', type: 'income' },
            { name: 'Deposit', type: 'income' },
            { name: 'Payroll/Salary', type: 'income' },
            { name: 'Cash', type: 'income' },
            { name: 'Transfer', type: 'other' },
            { name: 'Uncategorized', type: 'other' },
        ],
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
