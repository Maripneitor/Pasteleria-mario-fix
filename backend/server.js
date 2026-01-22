// --- CONFIGURACIÓN DE ENTORNO ---
// Carga las variables de entorno desde el archivo .env al inicio de la aplicación
require('dotenv').config();

// --- IMPORTACIÓN DE MÓDULOS ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // Seguridad básica
const rateLimit = require('express-rate-limit'); // Limitación de peticiones
const { sequelize } = require('./server/models');
const { conectarDB } = require('./server/config/database');

// --- IMPORTACIÓN DE RUTAS ---
const authRoutes = require('./server/routes/authRoutes');
const folioRoutes = require('./server/routes/folioRoutes');
const userRoutes = require('./server/routes/userRoutes');
const clientRoutes = require('./server/routes/clientRoutes');
const whatsappRoutes = require('./server/routes/whatsappRoutes');
const dashboardRoutes = require('./server/routes/dashboardRoutes');
const aiSessionRoutes = require('./server/routes/aiSessionRoutes');
const testRoutes = require('./server/routes/testRoutes');
const dictationRoutes = require('./server/routes/dictationRoutes');
const ingredientRoutes = require('./server/routes/ingredientRoutes');
const ingredientController = require('./server/controllers/ingredientController');
const createDevUser = require('./scripts/create-dev-user');

// --- TAREAS PROGRAMADAS ---
require('./server/cronJobs');

// --- CONFIGURACIÓN DE LA APLICACIÓN ---
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
conectarDB();

// --- MIDDLEWARES DE SEGURIDAD Y CONFIGURACIÓN ---
app.use(helmet()); // Headers de seguridad HTTP

// CORS Configurado para Multi-tenant
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Branch-ID', 'X-Org-ID'], // Permitir headers de tenant
  credentials: true
}));

// Rate Limit Global para prevenir DoS básico
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Limite de peticiones por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos'
});
app.use('/api/', globalLimiter);

app.use(express.json({ limit: '10mb' })); // Limitar tamaño de body para evitar sobrecarga de memoria

// Servir archivos estáticos de la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- RUTAS DE LA API ---
app.get('/', (req, res) => {
  res.json({ message: '¡API de la Pastelería La Fiesta funcionando con Multi-Tenancy!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/folios', folioRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/webhooks', whatsappRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai-sessions', aiSessionRoutes);
app.use('/api/test', testRoutes);
app.use('/api/dictation', dictationRoutes);
app.use('/api/ingredients', ingredientRoutes);

// --- INICIO DEL SERVIDOR SEGURO ---
// Eliminamos alter:true y migraciones manuales del código de arranque
sequelize.authenticate().then(async () => {
  console.log('✅ Conexión a base de datos establecida. Sistema RBAC activo.');

  await createDevUser();
  await ingredientController.seedIngredients();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  });
}).catch(err => console.error('❌ Error fatal:', err));