const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FolioNote = sequelize.define('FolioNote', {
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
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    createdBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'created_by'
    }
}, {
    tableName: 'folio_notes',
    timestamps: false
});

module.exports = FolioNote;
