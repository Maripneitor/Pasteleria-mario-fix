// backend/server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CAMBIO: Importación desestructurada
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

// CAMBIO: Aplicamos el middleware de autenticación extraído
router.use(authMiddleware);

// Rutas protegidas por permisos de gestión de usuarios
router.route('/')
    .get(checkPermission('users.manage'), userController.getAllUsers)
    .post(checkPermission('users.manage'), userController.createUser);

router.route('/:id')
    .put(checkPermission('users.manage'), userController.updateUser)
    .delete(checkPermission('users.manage'), userController.deleteUser);

module.exports = router;