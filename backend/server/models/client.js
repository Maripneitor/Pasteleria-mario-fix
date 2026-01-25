const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  // phone2 removed to match DB schema // Para teléfonos adicionales
}, { tableName: 'clients', paranoid: true });

module.exports = Client;