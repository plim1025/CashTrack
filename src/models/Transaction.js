const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const TransactionSchema = new Schema({
    userID: requiredString,
    transactionID: String,
    accountID: String,
    description: requiredString,
    amount: requiredString,
    category: requiredString,
    merchant: String,
    date: {
        type: Date,
        required: true,
    },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
