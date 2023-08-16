//adminRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.delete('/deleteInactiveUsers', authMiddleware.isAdmin, userController.deleteInactiveUsers);

router.get('/admin', authMiddleware.isAdmin, userController.getAllUsers);

module.exports = router;