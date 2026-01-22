const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRole = sequelize.define('UserRole', {
    userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'user_id'
    },
    roleId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: 'role_id'
    },
    branchId: {
        type: DataTypes.BIGINT,
        primaryKey: true, // Composite PK includes branchId
        allowNull: true,  // Nullable if role scope is Global
        field: 'branch_id'
    }
}, {
    tableName: 'user_roles',
    timestamps: false
});

module.exports = UserRole;
