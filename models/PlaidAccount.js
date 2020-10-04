const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const PlaidAccountSchema = new Schema({
    userID: requiredString,
    id: requiredString,
    batchID: requiredString,
    name: requiredString,
    institution: requiredString,
    type: requiredString,
    subtype: requiredString,
    mask: requiredString,
    available: Number,
    creditLimit: Number,
    lastUpdated: {
        type: Date,
        required: true,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
});

const PlaidAccount = mongoose.model('PlaidAccount', PlaidAccountSchema);

module.exports = PlaidAccount;
