const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const PlaidAccountSchema = new Schema({
    id: requiredString,
    batchID: requiredString,
    name: requiredString,
    institution: requiredString,
    type: requiredString,
    mask: requiredString,
    balance: {
        type: Number,
        required: true,
    },
    available: Number,
    creditLimit: Number,
});

const PlaidAccount = mongoose.model('PlaidAccount', PlaidAccountSchema);

module.exports = PlaidAccount;
