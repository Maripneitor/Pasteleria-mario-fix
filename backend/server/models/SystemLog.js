const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemLog = sequelize.define('SystemLog', {
    level: {
        type: DataTypes.ENUM('info', 'warn', 'error', 'security'),
        allowNull: false,
        defaultValue: 'info'
    },
    section: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Module or area (e.g., Auth, Database, Payments)'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    meta: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional context like userId, IP, request body'
    }
}, {
    tableName: 'system_logs',
    timestamps: true,
    updatedAt: false // Only createdAt is needed for logs
});

module.exports = SystemLog;
