// routes/indexRoute.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aplica el middleware de autenticación a todas las rutas de este archivo
router.use(authMiddleware.isAuthenticated);

router.get('/', productController.showAllProducts);

module.exports = router;