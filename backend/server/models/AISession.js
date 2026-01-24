const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AISession = sequelize.define('AISession', {
  whatsappConversation: { type: DataTypes.TEXT('long'), allowNull: false },
  extractedData: { type: DataTypes.JSON, allowNull: false }, // Datos que la IA va armando
  imageUrls: { type: DataTypes.JSON, allowNull: true },
  chatHistory: { type: DataTypes.JSON, allowNull: true }, // Chat empleado vs IA
  status: { type: DataTypes.ENUM('active', 'completed', 'cancelled'), defaultValue: 'active' }
}, { tableName: 'ai_sessions' });

module.exports = AISession;