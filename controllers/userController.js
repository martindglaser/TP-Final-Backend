// controllers/userController.js

const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'email rol');
        res.render('admin', { users: users });  // Renderizar la vista admin.hbs
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// ... otras funciones del controlador ...
