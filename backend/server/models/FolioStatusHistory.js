const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FolioStatusHistory = sequelize.define('FolioStatusHistory', {
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
    oldStatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'old_status'
    },
    newStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'new_status'
    },
    changedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'changed_at'
    },
    changedBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'changed_by'
    },
    note: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'folio_status_history',
    timestamps: false,
    indexes: [
        {
            fields: ['folio_id']
        }
    ]
});

module.exports = FolioStatusHistory;
