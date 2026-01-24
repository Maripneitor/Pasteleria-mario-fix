const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Flavor = sequelize.define('Flavor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
        // Removed unique: true to allow multiple owners to have "Vanilla"
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Owner ID (Tenant). If null, it is a global/system flavor.'
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        comment: 'Costo extra por sabor (opcional)'
    },
    isNormal: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Disponible para pasteles normales'
    },
    isTier: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Disponible para pisos de pasteles especiales'
    }
}, {
    tableName: 'flavors',
    timestamps: true,
    paranoid: true
});

module.exports = Flavor;
