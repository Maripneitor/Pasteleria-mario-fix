const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware, requireBranchMembership, checkPermission } = require('../middleware/authMiddleware');

// 1. PRIMERO: Validar el Token (Crea req.user)
router.use(authMiddleware);

// 2. SEGUNDO: Validar la Sucursal (Crea req.tenant usando req.user.id)
router.use(requireBranchMembership);

// 3. TERCERO: Rutas con permisos específicos
router.get('/', checkPermission('clients.read'), clientController.getAllClients);
router.post('/', checkPermission('clients.create'), clientController.createClient);

module.exports = router;