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

exports.deleteInactiveUsers = async (req, res) => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const deletedUsers = await User.deleteMany({ lastLoggedIn: { $lt: fiveMinutesAgo } });

        res.json({ message: `${deletedUsers.deletedCount} usuarios inactivos eliminados` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
};