const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
    roleId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'role_id'
    },
    permissionId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'permission_id'
    }
}, {
    tableName: 'role_permissions',
    timestamps: false
});

module.exports = RolePermission;
