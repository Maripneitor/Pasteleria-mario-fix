const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Branch = sequelize.define('Branch', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: {
        type: DataTypes.BIGINT, // Mapped to organization_id via field or standard snake_case if config set. But here we see explicit field mapping in previous file? No, usually sequelize uses camelCase. Let's check init.sql: organization_id. 
        // Previous Branch.js had: field: 'organization_id'
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
    maxEmployeesAllowed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        field: 'max_employees_allowed'
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
    paranoid: true, // Soft delete
    createdAt: 'createdAt', // init.sql uses strict naming? init.sql has createdAt. 
    // Previous Branch.js had createdAt: 'created_at'. 
    // BUT init.sql shows: `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
    // It seems init.sql uses camelCase for the column name in `createdAt`.
    // Wait, let's look at init.sql again.
    // 56:   `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    // 57:   `updatedAt` datetime NOT NULL ...
    // So column names are `createdAt`, `updatedAt`, `deletedAt`. 
    // The previous Branch.js had `createdAt: 'created_at'`. This assumes the DB column is `created_at`. 
    // BUT init.sql actually says `createdAt`. 
    // If I strictly follow init.sql, I should NOT map to snake_case unless the DB column is snake_case.
    // The init.sql provided by user HAS `createdAt` (camelCase) as column name.
    // So I should remove the mapping if the DB column is indeed camelCase.
    // However, checking previous Branch.js line 41: `createdAt: 'created_at'`. 
    // If the USER provided init.sql has camelCase, then the previous model might be wrong or using a different convention?
    // User says: "🔍 Observaciones ... Has solucionado el problema de los centavos ... Soft Deletes"
    // The user provided init.sql content in Step 7. 
    // Line 56: `createdAt` datetime ...
    // So the column name IS `createdAt`.
    // So I will fix the mapping to be default or explicit 'createdAt'. 
    // I will use default (which is camelCase usually) or explicit 'createdAt'.

    // Correction: I will stick to what init.sql says. 
    // init.sql: `organization_id` (snake), `max_employees_allowed` (snake), `createdAt` (camel), `updatedAt` (camel), `deletedAt` (camel).

    indexes: [
        {
            unique: true,
            fields: ['organization_id', 'name']
        }
    ]
});

module.exports = Branch;
