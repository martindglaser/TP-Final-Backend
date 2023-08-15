const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Referencia a productos
    rol: { type: String, default: 'user' }, // Agrega roles si los necesitas
});

const User = mongoose.model('User', userSchema);

module.exports = User;
