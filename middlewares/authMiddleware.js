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
    isAdminOrPremium: (req, res, next) => {
        if (req.session.user && (req.session.user.rol === 'admin' || req.session.user.rol === 'premium')) {
            next();
        } else {
            res.redirect('/');
        }
    },

    isAdminOrOwner: async (req, res, next) => {
        try {
            if (req.session.user) {
                const user = req.session.user;
                const isAdmin = user.rol === 'admin';
                const productId = req.params.id;

                // Consultar la base de datos para obtener el propietario del producto
                const product = await Product.findById(productId);
                if (isAdmin || (product && product.owner === user.email)) {
                    req.isAdminOrOwner = true;
                    next();
                } else {
                    res.redirect('/');
                }
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en la verificación de permisos' });
        }
    },

    showAllProducts: async (req, res) => {
        try {
            if (req.session.user && req.session.user.products) {
                const products = await Product.find();
                res.render('product/all', { products });
            } else {
                // Manejo si el usuario no está definido o no tiene la propiedad 'products'
                res.status(403).json({ error: 'Acceso no autorizado' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cargar los productos' });
        }
    }
};
