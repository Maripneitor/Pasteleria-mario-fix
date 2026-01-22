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
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login_at'
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Legacy field. Use UserBranchMembership for multi-tenant structure.'
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
  /* role field removed in favor of UserRole table */
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Granular permissions override'
  }
}, {
  tableName: 'users',
  timestamps: true // Ensure timestamps are enabled as per SQL schema recommendation
});

module.exports = User;