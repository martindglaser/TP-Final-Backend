// controllers/productController.js

const { isAdminOrOwner } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');

exports.showCreateForm = (req, res) => {
    res.render('product/create');
};

exports.createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const owner = req.session.user._id; // Obtén el ID del usuario desde la sesión

    try {
        const product = new Product({
            name,
            description,
            price,
            owner,
        });
        await product.save();

        // Agrega el ID del producto a la lista de productos del usuario
        const user = await User.findById(owner);
        user.products.push(product._id);
        await user.save();

        res.redirect('/products/all');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la creación del producto' });
    }
};


exports.showEditForm = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        res.render('product/edit', { product });
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
        if (req.session.user && req.session.user.products) {
            const products = await Product.find();
            res.render('product/all', { products, isAdminOrOwner: req.isAdminOrOwner });
        } else {
            // Manejo si el usuario no está definido o no tiene la propiedad 'products'
            res.status(403).json({ error: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los productos' });
    }
};




exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Verifica si el usuario es administrador o el propietario del producto
        if (req.session.user.rol === 'admin' || product.owner === req.session.user.email) {
            await Product.deleteOne({ _id: productId });  // Usamos deleteOne para eliminar el producto
            return res.redirect('/products/all');
        } else {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};