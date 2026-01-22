const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Branch = sequelize.define('Branch', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'organization_id'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isMain: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_main'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Closed'),
        allowNull: false,
        defaultValue: 'Active'
    }
}, {
    tableName: 'branches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['organization_id', 'name']
        }
    ]
});

module.exports = Branch;
