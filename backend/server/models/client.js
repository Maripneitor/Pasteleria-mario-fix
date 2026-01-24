const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone2: { type: DataTypes.STRING, allowNull: true } // Para teléfonos adicionales
}, { tableName: 'clients', paranoid: true });

module.exports = Client;