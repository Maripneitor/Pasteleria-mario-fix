// backend/server/models/user.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active' // Mapeo crítico para coincidir con init.sql
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login_at'
  },
  ownerId: { type: DataTypes.INTEGER, allowNull: true },
  dashboardConfig: { type: DataTypes.JSON, defaultValue: {} },
  ownerSeal: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('active', 'pending_verification', 'banned'),
    defaultValue: 'active'
  },
  permissions: { type: DataTypes.JSON, defaultValue: {} }
}, {
  tableName: 'users'
});

module.exports = User;