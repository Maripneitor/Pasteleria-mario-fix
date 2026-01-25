const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { authMiddleware, checkPermission } = require('../middleware/authMiddleware');

// Rutas protegidas
// GET /api/branches/
router.get('/', authMiddleware, checkPermission('branches.read'), branchController.getAllBranches);

// GET /api/branches/:id
router.get('/:id', authMiddleware, checkPermission('branches.read'), branchController.getBranch);

// PUT /api/branches/:id
router.put('/:id', authMiddleware, checkPermission('branches.update'), branchController.updateBranch);

module.exports = router;
