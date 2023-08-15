// middlewares/authMiddleware.js

const Product = require('../models/Product'); // Añade esta línea para importar el modelo Product

module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    },

    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.rol === 'admin') {
            next();
        } else {
            res.redirect('/');
        }
    },

    isAdminOrOwner: async (req, res, next) => {  // Movido aquí
        try {
            if (req.session.user) {
                const user = req.session.user;
                const isAdmin = user.rol === 'admin';
                const productId = req.params.id;

                // Consulta la base de datos para obtener el propietario del producto
                const product = await Product.findById(productId);
                const isOwner = product && product.owner === user.email;

                if (isAdmin || isOwner) {
                    req.isAdminOrOwner = true;
                }
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en la verificación de permisos' });
        }
    }
};
