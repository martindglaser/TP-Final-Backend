// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
//const authMiddleware = require('../middlewares/authMiddleware');  // Importar el middleware

router.get('/all',/* authMiddleware.isAdmin,*/ userController.getAllUsers);

module.exports = router;
