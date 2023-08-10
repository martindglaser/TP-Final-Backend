// middlewares/authMiddleware.js

module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    },

    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.rol === 'admin') {  // Ajustar a "rol"
            next();
        } else {
            res.redirect('/');
        }
    }
};
