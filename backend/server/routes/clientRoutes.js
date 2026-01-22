const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { checkPermission } = require('../middleware/authMiddleware');

// Define las rutas para la colección de clientes
router.route('/')
    .get(checkPermission('clients.read'), clientController.getAllClients)   // GET /api/clients
    .post(checkPermission('clients.create'), clientController.createClient);  // POST /api/clients

module.exports = router;