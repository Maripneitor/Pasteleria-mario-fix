const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ==================== INICIO DE LA CORRECCIÓN ====================
  phone2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  branchId: {
    type: DataTypes.BIGINT,
    allowNull: true, // Nullable temporarily for migration, but should be populated
    field: 'branch_id'
  }
}, {
  tableName: 'clients',
  indexes: [
    {
      unique: true,
      fields: ['branch_id', 'phone'],
      name: 'uq_clients_phone_branch'
    },
    {
      fields: ['branch_id']
    }
  ]
});

module.exports = Client;