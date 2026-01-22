const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    folioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'folio_id'
    },
    branchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'branch_id'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM('Cash', 'Card', 'Transfer', 'Other'),
        allowNull: false,
        defaultValue: 'Cash'
    },
    reference: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    paidAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'paid_at'
    },
    createdBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'created_by'
    }
}, {
    tableName: 'payments',
    timestamps: false,
    indexes: [
        {
            fields: ['folio_id']
        },
        {
            fields: ['branch_id', 'paid_at']
        }
    ]
});

module.exports = Payment;
