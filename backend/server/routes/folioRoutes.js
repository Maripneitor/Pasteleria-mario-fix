const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const folioController = require('../controllers/folioController');
const { checkPermission } = require('../middleware/authMiddleware');

// Configuración de Multer: Disk Storage para evitar desbordamiento de memoria (DoS)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Sanitizar nombre de archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'folio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos básico
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite 5MB por archivo
  fileFilter: fileFilter
});

// --- RUTA PARA PDFs MASIVOS (ETIQUETAS Y COMANDAS) ---
router.get('/day-summary-pdf', checkPermission('folios.read'), folioController.generateDaySummaryPdf);

// --- Cash Close ---
router.get('/cash-close', checkPermission('cashclose.read'), folioController.getCashClose);

// --- RUTA PARA OBTENER ESTADÍSTICAS (SÓLO ADMIN) ---
router.get('/statistics', checkPermission('folios.stats.read'), folioController.getStatistics);

// --- RUTA PARA ESTADÍSTICAS DE PRODUCTIVIDAD (SÓLO ADMIN) ---
router.get('/productivity', checkPermission('folios.stats.read'), folioController.getProductivityStats);

// --- RUTA PARA REPORTE DE COMISIONES (SÓLO ADMIN) ---
router.get('/commission-report', checkPermission('folios.stats.read'), folioController.generateCommissionReport);

// Rutas para la colección de folios (/api/folios)
router.route('/')
  .get(checkPermission('folios.read'), folioController.getAllFolios)
  .post(checkPermission('folios.create'), upload.array('referenceImages', 5), folioController.createFolio);

// Ruta para cálculo de precios (sin guardar) - Puede ser público o requerir permiso básico
router.post('/calculate', checkPermission('folios.create'), folioController.calculateTotals);

// Rutas para un folio específico (/api/folios/:id)
router.route('/:id')
  .get(checkPermission('folios.read'), folioController.getFolioById)
  .put(checkPermission('folios.update'), upload.array('referenceImages', 5), folioController.updateFolio)
  .delete(checkPermission('folios.delete'), folioController.deleteFolio);

// Ruta especial para generar el PDF de un solo folio
router.get('/:id/pdf', checkPermission('folios.read'), folioController.generateFolioPdf);

// Ruta para generar el PDF de la etiqueta de un solo folio
router.get('/:id/label-pdf', checkPermission('folios.read'), folioController.generateLabelPdf);

// --- RUTA PARA MARCAR UN FOLIO COMO IMPRESO ---
router.patch('/:id/mark-as-printed', checkPermission('folios.update'), folioController.markAsPrinted);

// --- RUTA PARA CANCELAR UN FOLIO ---
router.patch('/:id/cancel', checkPermission('folios.cancel'), folioController.cancelFolio);

// --- RUTA PARA ACTUALIZAR ESTADOS DEL FOLIO ---
router.patch('/:id/status', checkPermission('folios.update'), folioController.updateFolioStatus);

module.exports = router;