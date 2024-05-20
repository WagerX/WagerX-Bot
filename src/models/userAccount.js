const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    userName: String,
    balance: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
