// controllers/userController.js

const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    const user = req.session.user;
    try {
        const users = await User.find({}, 'email rol lastLoggedIn');
        res.render('admin', { users: users, user });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.deleteInactiveUsers = async (req, res) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 60 * 60 * 48 * 1000).toISOString();
        const deletedUsers = await User.deleteMany({ lastLoggedIn: { $lt: twoDaysAgo } });
        //mandar mail a los usuarios eliminados
        res.json({ message: `${deletedUsers.deletedCount} usuarios inactivos eliminados` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
};