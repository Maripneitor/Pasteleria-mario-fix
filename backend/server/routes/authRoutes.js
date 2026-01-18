const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para generar invitación (Protegida)
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware
router.post('/generate-invite', authMiddleware, authController.generateInviteToken);

module.exports = router;
