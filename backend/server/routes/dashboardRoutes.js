// backend/server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// CAMBIO: Usa desestructuración para obtener 'authMiddleware' y 'checkPermission'
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

// CAMBIO: Usa checkPermission en lugar de la lógica local de 'requireAdmin'
// (Asegúrate de que estos permisos existan en tu base de datos)
router.get('/owner', authMiddleware, checkPermission('dashboard.owner.view'), dashboardController.getOwnerMetrics);
router.get('/developer', authMiddleware, checkPermission('dashboard.dev.view'), dashboardController.getDeveloperMetrics);
router.get('/daily-summary', authMiddleware, checkPermission('dashboard.summary.view'), dashboardController.getDailySummary);

// --- GLOBAL ANALYTICS (Admin Only) ---
router.get('/admin/analytics/sales', authMiddleware, checkPermission('admin.analytics'), dashboardController.getGlobalSales);
router.get('/admin/tenants', authMiddleware, checkPermission('admin.tenants'), dashboardController.getTenants);

module.exports = router;
