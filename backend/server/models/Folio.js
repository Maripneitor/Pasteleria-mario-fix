const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Folio = sequelize.define('Folio', {
  folioNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of the Owner (Tenant) closest to the user who created this folio'
  },
  folioType: {
    type: DataTypes.STRING, // Se cambia temporalmente a STRING para evitar error de truncado por datos incompatibles
    allowNull: false
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  deliveryTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  persons: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shape: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cakeFlavor: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  filling: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  designDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dedication: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  advancePayment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // --- MODIFICACIÓN APLICADA ---
  // Se añade el nuevo estado 'Pendiente' para los folios generados por la IA
  // que están esperando confirmación humana.
  status: {
    type: DataTypes.ENUM('Pendiente', 'Nuevo', 'En Producción', 'Listo para Entrega', 'Entregado', 'Cancelado'),
    defaultValue: 'Nuevo'
  },
  signature: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: true
  },
  imageComments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  tiers: {
    type: DataTypes.JSON,
    allowNull: true
  },
  accessories: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  additional: {
    type: DataTypes.JSON,
    allowNull: true
  },
  complements: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  hasExtraHeight: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isPrinted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fondantChecked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  dataChecked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  classification: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Auto-calculated classification: { priority, urgency, valueLevel }'
  },
  branchId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'branch_id'
  }
}, {
  tableName: 'folios',
  indexes: [
    {
      unique: true,
      fields: ['branch_id', 'folioNumber'],
      name: 'uq_folios_number_branch'
    },
    {
      fields: ['branch_id']
    }
  ]
});

module.exports = Folio;