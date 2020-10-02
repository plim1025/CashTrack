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
    amount: {
        type: Number,
        required: true,
    },
    category: requiredString,
    merchant: String,
    date: {
        type: Date,
        required: true,
    },
    selected: {
        type: Boolean,
        require: true,
    },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
