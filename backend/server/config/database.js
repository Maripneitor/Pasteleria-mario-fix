const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Evita saturar la consola con logs de SQL
    dialectOptions: { charset: 'utf8mb4' }
  }
);

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
};

module.exports = { sequelize, conectarDB };