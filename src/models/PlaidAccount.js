const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const PlaidAccountSchema = new Schema({
    id: requiredString,
    name: requiredString,
    institution: requiredString,
    institutionID: requiredString,
    type: requiredString,
    mask: requiredString,
    balance: {
        type: Number,
        required: true,
    },
});

const PlaidAccount = mongoose.model('PlaidAccount', PlaidAccountSchema);

module.exports = PlaidAccount;
