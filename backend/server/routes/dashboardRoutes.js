const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware, requireBranchMembership, checkPermission } = require('../middleware/authMiddleware');

// Ruta principal del Dashboard: Requiere Token + Sucursal + Permiso
router.get('/daily-summary',
    authMiddleware,
    requireBranchMembership,
    checkPermission('dashboard.view_stats'),
    dashboardController.getDailySummary
);

module.exports = router;
