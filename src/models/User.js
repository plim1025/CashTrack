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
                transactionID: requiredString,
                accountID: requiredString,
                amount: requiredNumber,
                category: {
                    type: String,
                    required: true,
                    default: '',
                },
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
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
