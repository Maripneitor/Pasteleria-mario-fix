// --- CONFIGURACIÓN DE ENTORNO ---
// Carga las variables de entorno desde el archivo .env al inicio de la aplicación
require('dotenv').config();

// --- IMPORTACIÓN DE MÓDULOS ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./server/models');
const { conectarDB } = require('./server/config/database');

// --- IMPORTACIÓN DE RUTAS ---
const authRoutes = require('./server/routes/authRoutes');
const folioRoutes = require('./server/routes/folioRoutes');
const userRoutes = require('./server/routes/userRoutes');
const clientRoutes = require('./server/routes/clientRoutes');
// const whatsappRoutes = require('./server/routes/whatsappRoutes'); // <-- RUTA NUEVA
const dashboardRoutes = require('./server/routes/dashboardRoutes');
const aiSessionRoutes = require('./server/routes/aiSessionRoutes');
const testRoutes = require('./server/routes/testRoutes');
const dictationRoutes = require('./server/routes/dictationRoutes');
const ingredientRoutes = require('./server/routes/ingredientRoutes');
const ingredientController = require('./server/controllers/ingredientController');

// --- TAREAS PROGRAMADAS ---
// Esta línea importa e inicia las tareas programadas (como el envío de correos)
require('./server/cronJobs');

// --- CONFIGURACIÓN DE LA APLICACIÓN ---
const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto del entorno o 3000 por defecto

// Conectar a la base de datos
conectarDB();

// --- MIDDLEWARES ---
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Permitir Vite y local
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Servir archivos estáticos de la carpeta 'uploads' (Imágenes, etc)
// Mantenemos esto para que el frontend pueda acceder a recursos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ALERTA: Se ha eliminado el serving de archivos estáticos del root (antiguo frontend)
// ALERTA: Se ha eliminado el serving de archivos estáticos del root (antiguo frontend)

// --- RUTAS DE LA API ---
app.get('/', (req, res) => {
  res.json({ message: '¡API de la Pastelería La Fiesta funcionando!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/folios', folioRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/webhooks', whatsappRoutes); // <-- USANDO LA NUEVA RUTA
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai-sessions', aiSessionRoutes);
app.use('/api/test', testRoutes);
app.use('/api/dictation', dictationRoutes);

app.use('/api/ingredients', ingredientRoutes);


// --- INICIO DEL SERVIDOR ---
sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Base de datos sincronizada y robusta');
  console.log('🔄 Modelos sincronizados con la base de datos.');

  // --- MIGRACIÓN FORZADA DE COLUMNAS ---
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('folios');
    const userTableInfo = await queryInterface.describeTable('users');

    if (!tableInfo.signature) {
      console.log('⚠️ Columna "signature" no encontrada en "folios". Agregando...');
      await queryInterface.addColumn('folios', 'signature', {
        type: sequelize.Sequelize.TEXT('long'), // LONGTEXT
        allowNull: true
      });
      console.log('✅ Columna "signature" agregada exitosamente.');
    }

    if (!userTableInfo.ownerSeal) {
      console.log('⚠️ Columna "ownerSeal" no encontrada en "users". Agregando...');
      await queryInterface.addColumn('users', 'ownerSeal', {
        type: sequelize.Sequelize.TEXT,
        allowNull: true
      });
      console.log('✅ Columna "ownerSeal" agregada.');
    }
    if (!userTableInfo.ownerId) {
      console.log('⚠️ Columna "ownerId" no encontrada en "users". Agregando...');
      await queryInterface.addColumn('users', 'ownerId', {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true
      });
      console.log('✅ Columna "ownerId" agregada.');
    }

    if (!userTableInfo.status) {
      console.log('⚠️ Columna "status" no encontrada en "users". Agregando...');
      await queryInterface.addColumn('users', 'status', {
        type: sequelize.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active'
      });
      console.log('✅ Columna "status" agregada.');
    }

    if (!userTableInfo.permissions) {
      console.log('⚠️ Columna "permissions" no encontrada en "users". Agregando...');
      await queryInterface.addColumn('users', 'permissions', {
        type: sequelize.Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      });
      console.log('✅ Columna "permissions" agregada.');
    }

    console.log('✅ Backend Estabilizado');

  } catch (migError) {
    console.error('❌ Error en migración manual:', migError);
  }
  // -------------------------------------

  await ingredientController.seedIngredients();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('❌ Error al sincronizar con la base de datos:', error);
});