const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
// Cambia 'verifyToken' por la desestructuración de 'authMiddleware'
const { authMiddleware: verifyToken, requireBranchMembership } = require('../middleware/authMiddleware');

// Rutas protegidas y con contexto de sucursal
router.get('/flavors', verifyToken, requireBranchMembership, ingredientController.getFlavors);
router.get('/fillings', verifyToken, requireBranchMembership, ingredientController.getFillings);

// Rutas protegidas para gestión (solo admin o usuarios autenticados según se prefiera)
// Por ahora usamos verifyToken para que al menos estén logueados
router.post('/flavors', verifyToken, ingredientController.addFlavor);
router.put('/flavors/:id', verifyToken, ingredientController.updateFlavor);
router.delete('/flavors/:id', verifyToken, ingredientController.deleteFlavor);

router.post('/fillings', verifyToken, ingredientController.addFilling);
router.put('/fillings/:id', verifyToken, ingredientController.updateFilling);
router.delete('/fillings/:id', verifyToken, ingredientController.deleteFilling);

module.exports = router;
