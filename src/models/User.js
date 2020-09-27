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
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
