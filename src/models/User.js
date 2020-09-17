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
                    enum: ['expenses', 'income', 'other'],
                },
            },
        ],
        default: [
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
        ],
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
