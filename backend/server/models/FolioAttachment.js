const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FolioAttachment = sequelize.define('FolioAttachment', {
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
    fileUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'file_url'
    },
    fileType: {
        type: DataTypes.ENUM('Image', 'PDF', 'Other'),
        allowNull: false,
        defaultValue: 'Image',
        field: 'file_type'
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
    tableName: 'folio_attachments',
    timestamps: false
});

module.exports = FolioAttachment;
