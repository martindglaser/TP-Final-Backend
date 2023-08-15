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

    isAdminOrOwner: async (req, res, next) => {
        try {
            console.log('Middleware isAdminOrOwner ejecutándose');

            if (req.session.user) {
                const user = req.session.user;
                console.log('Usuario en sesión:', user);

                const isAdmin = user.rol === 'admin';
                console.log('¿Es administrador?', isAdmin);

                const productId = req.params.id;
                console.log('ID del producto:', productId);

                // Consulta la base de datos para obtener el propietario del producto
                const product = await Product.findById(productId);
                console.log('Propietario del producto:', product.owner);

                const isOwner = product && product.owner === user.email;
                console.log('¿Es propietario?', isOwner);

                if (isAdmin || isOwner) {
                    req.isAdminOrOwner = true;
                    console.log('isAdminOrOwner = true');
                }
            }
            next();
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
