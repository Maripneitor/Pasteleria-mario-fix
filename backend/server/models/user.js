const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  // Sequelize crea el 'id' automáticamente
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ==================== INICIO DE LA MODIFICACIÓN ====================
  role: {
    type: DataTypes.ENUM('Desarrollador', 'Dueño', 'Empleado'),
    allowNull: false,
    defaultValue: 'Empleado'
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of the Owner user this user belongs to. If null and role is Owner, they are the root.'
  },
  dashboardConfig: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'JSON settings for enabled tabs and view preferences'
  },
  ownerSeal: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL or base64 of the custom seal for folios'
  },
  status: {
    type: DataTypes.ENUM('active', 'pending_verification', 'banned'),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Status: active, pending_verification, banned'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Granular permissions override'
  }
}, {
  tableName: 'users'
});

module.exports = User;