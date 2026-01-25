const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
    roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'role_id'
    },
    permissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'permission_id'
    }
}, {
    tableName: 'role_permissions',
    timestamps: true
});

module.exports = RolePermission;
