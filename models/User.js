// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    rol: String,
    lastLoggedIn: Date,
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
    }],
});

module.exports = mongoose.model('User', userSchema);