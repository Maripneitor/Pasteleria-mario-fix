const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FolioHistory = sequelize.define('FolioHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    folioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'folios', key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' }
    },
    branchId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'branch_id',
        references: { model: 'branches', key: 'id' }
    },
    action: {
        type: DataTypes.ENUM('CREATE', 'UPDATE', 'CANCEL', 'STATUS_CHANGE'),
        allowNull: false,
        defaultValue: 'UPDATE'
    },
    oldData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    newData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'folio_histories',
    timestamps: true,
    updatedAt: false,
    deletedAt: false
});

module.exports = FolioHistory;
