const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    scope: {
        type: DataTypes.ENUM('Global', 'Branch'),
        allowNull: false,
        defaultValue: 'Branch'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'roles',
    timestamps: true,
    paranoid: true // Matches deletedAt in SQL
});

module.exports = Role;
