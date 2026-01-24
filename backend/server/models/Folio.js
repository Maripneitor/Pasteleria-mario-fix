const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Folio = sequelize.define('Folio', {
  folioNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  folioType: { type: DataTypes.ENUM('Normal', 'Base/Especial'), allowNull: false },
  deliveryDate: { type: DataTypes.DATEONLY, allowNull: false },
  deliveryTime: { type: DataTypes.TIME, allowNull: false },
  persons: { type: DataTypes.INTEGER, allowNull: false },
  shape: { type: DataTypes.STRING, allowNull: false },
  cakeFlavor: { type: DataTypes.JSON, allowNull: true },
  filling: { type: DataTypes.JSON, allowNull: true },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  advancePayment: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Nuevo', 'En Producción', 'Listo para Entrega', 'Entregado', 'Cancelado'),
    defaultValue: 'Nuevo'
  },
  isPrinted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'folios' });

module.exports = Folio;