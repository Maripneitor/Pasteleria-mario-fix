const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
// Add auth middleware if needed - assuming protected
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); 

// For now, public or simple token verification if globally applied. 
// Assuming server.js applies auth or we add it here.
// Let's assume we want them protected. checking folioRoutes for pattern.
// folioRoutes uses verifyToken. 
const verifyToken = require('../middleware/authMiddleware');

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Administrador') {
        next();
    } else {
        res.status(403).json({ message: 'Requiere acceso de Administrador' });
    }
};

router.get('/owner', verifyToken, dashboardController.getOwnerMetrics);
router.get('/developer', verifyToken, dashboardController.getDeveloperMetrics);
router.get('/daily-summary', verifyToken, dashboardController.getDailySummary);

// --- GLOBAL ANALYTICS (Admin Only) ---
router.get('/admin/analytics/sales', verifyToken, requireAdmin, dashboardController.getGlobalSales);
router.get('/admin/tenants', verifyToken, requireAdmin, dashboardController.getTenants);
router.put('/admin/tenants/:id/features', verifyToken, requireAdmin, dashboardController.updateTenantFeatures);
router.get('/admin/logs', verifyToken, requireAdmin, dashboardController.getSecurityLogs);

module.exports = router;
