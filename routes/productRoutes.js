// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/create', authMiddleware.isAdminOrPremium, productController.showCreateForm);

router.get('/cart', authMiddleware.isAuthenticated, productController.showCart);

router.post('/create', authMiddleware.isAdminOrPremium, productController.createProduct);

router.get('/edit/:id', authMiddleware.isAdminOrOwner, productController.showEditForm);

router.post('/edit/:id', authMiddleware.isAdminOrOwner, productController.editProduct);

router.get('/:id/delete', authMiddleware.isAdminOrOwner, productController.deleteProduct);

router.post('/add-to-cart', authMiddleware.isAuthenticated, productController.addToCart);

router.delete('/vaciar-carrito', authMiddleware.isAuthenticated, productController.vaciarCarrito);

module.exports = router;
