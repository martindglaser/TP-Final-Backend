// controllers/productController.js
const nodemailer = require('nodemailer');
const { isAdminOrOwner } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');

exports.showCreateForm = (req, res) => {
    const user = req.session.user;
    res.render('product/create', { user });
};
exports.showCart = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('cart.product');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let totalPrice = 0;

        user.cart.forEach(item => {
            totalPrice += item.quantity * item.product.price;
        });


        res.render('product/carrito', { user, totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar el carrito' });
    }
};


exports.createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const ownerEmail = req.session.user.email;

    try {
        const product = new Product({
            name,
            description,
            price,
            owner: ownerEmail,
        });
        await product.save();

        const user = await User.findOne({ email: ownerEmail }); // Cambiar findById a findOne
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.products) {
            user.products = []; // Inicializar como un array si es undefined
        }

        user.products.push(product._id);
        await user.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la creación del producto' });
    }
};



exports.showEditForm = async (req, res) => {
    const productId = req.params.id;
    const user = req.session.user;
    try {
        const product = await Product.findById(productId);
        res.render('product/edit', { product, user });
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar el formulario de edición' });
    }
};

exports.editProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;

    try {
        await Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'Error en la edición del producto' });
    }
};



exports.showAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        // Obtener el usuario actual de la sesión
        const user = req.session.user;

        // Agregar una propiedad "isOwner" a cada producto en función del propietario
        products.forEach(product => {
            if (user) {
                product.canModify = user.rol === 'admin' || user.email === product.owner;
            } else {
                product.canModify = false;
            }
        });

        res.render('product/all', { products, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
};




exports.deleteProduct = async (req, res) => {
    try {
        //wQI1m8TCLSYrlsNP2UXJ
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verifica si el usuario es administrador o el propietario del producto
        if (req.session.user.rol === 'admin' || product.owner === req.session.user.email) {
            // mandar mail al owner del producto

            await Product.deleteOne({ _id: productId });

            return res.redirect('/');
        } else {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};



exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.cart) {
            user.cart = [];
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        user.cart.push({ product: productId, quantity });
        await user.save();

        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};



exports.vaciarCarrito = async (req, res) => {
    try {
        const userId = req.session.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
};