// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para mostrar formulario de alta de producto
router.get('/create', authMiddleware.isAdmin, productController.showCreateForm);

// Ruta para manejar el alta de producto
router.post('/create', authMiddleware.isAdmin, productController.createProduct);

// Ruta para mostrar formulario de edición de producto
router.get('/edit/:id', authMiddleware.isAdmin, productController.showEditForm);

// Ruta para manejar la edición de producto
router.post('/edit/:id', authMiddleware.isAdmin, productController.editProduct);

router.get('/all', productController.showAllProducts);

router.get('/:id/delete', authMiddleware.isAdminOrOwner, productController.deleteProduct);


module.exports = router;
