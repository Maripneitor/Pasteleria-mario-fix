const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger ruta con JWT
router.post('/extract-folio', authMiddleware, aiController.extractFolioFromText);

module.exports = router;
