const mongoose = require('mongoose');

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
    removedTransactionIDs: {
        type: [String],
        default: [],
    },
    theme: {
        type: String,
        default: 'Light',
    },
    notification: {
        type: String,
        default: 'Weekly',
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
