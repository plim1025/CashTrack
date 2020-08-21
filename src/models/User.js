const mongoose = require('mongoose');
require('./Transaction');

const { Schema } = mongoose;

const requiredString = {
    type: String,
    required: true,
};

const UserSchema = new Schema({
    email: requiredString,
    password: requiredString,
    accessToken: String,
    itemID: String,
    institution: String,
    transactions: {
        type: [mongoose.model('Transaction').schema],
        required: true,
        default: [],
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
