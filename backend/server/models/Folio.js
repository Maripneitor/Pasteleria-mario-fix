const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Folio = sequelize.define('Folio', {
  folioNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  folioType: { type: DataTypes.ENUM('Sencillo', 'Especial'), allowNull: false }, // Updated enum values from init.sql
  deliveryDate: { type: DataTypes.DATEONLY, allowNull: false },
  deliveryTime: { type: DataTypes.TIME, allowNull: false },
  persons: { type: DataTypes.INTEGER, allowNull: false },

  // New Fields replacing cakeFlavor/filling strings
  flavorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'flavors', key: 'id' }
  },
  fillingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'fillings', key: 'id' }
  },

  designDescription: { type: DataTypes.TEXT, allowNull: false },
  dedication: { type: DataTypes.STRING, allowNull: true },
  deliveryLocation: { type: DataTypes.STRING, allowNull: false },

  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  advancePayment: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

  status: {
    type: DataTypes.ENUM('Nuevo', 'En Producción', 'Listo para Entrega', 'Entregado', 'Cancelado'),
    defaultValue: 'Nuevo'
  },

  responsibleUserId: { type: DataTypes.INTEGER, allowNull: true },
  clientId: { type: DataTypes.INTEGER, allowNull: true },
  branchId: { type: DataTypes.BIGINT, allowNull: false, field: 'branch_id' }

}, {
  tableName: 'folios',
  timestamps: true, // Enable timestamps
  paranoid: true    // Enable soft deletes
});

module.exports = Folio;