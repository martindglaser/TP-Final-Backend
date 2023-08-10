// controllers/authController.js

const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.showRegisterForm = (req, res) => {
    res.render('register');
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            password: hashedPassword,
            rol: 'regular',
        });
        await user.save();

        res.redirect('/auth/login');
    } catch (error) {
        res.status(500).json({ error: 'Error en el registro' });
    }
};

exports.showLoginForm = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (user && await bcrypt.compare(password, user.password)) {
            res.send('Inicio de sesión exitoso');
        } else {
            res.send('Credenciales incorrectas');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
};
