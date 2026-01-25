const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserBranchMembership = sequelize.define('UserBranchMembership', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    branchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'branch_id'
    },
    employmentType: {
        type: DataTypes.ENUM('Owner', 'Employee'),
        allowNull: false,
        defaultValue: 'Employee',
        field: 'employment_type'
    }
}, {
    tableName: 'user_branch_memberships',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at based on SQL schema
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'branch_id']
        }
    ]
});

module.exports = UserBranchMembership;
