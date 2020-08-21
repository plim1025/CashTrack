const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSchema = new Schema({
    accountType: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: String,
    date: {
        type: Date,
        required: true,
    },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
