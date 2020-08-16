const mongoose = require('mongoose');
require('./Transaction');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    transactions: {
        type: [mongoose.model('Transaction').schema],
        required: true,
        default: [],
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
