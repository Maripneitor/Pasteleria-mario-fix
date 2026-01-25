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
    branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'branch_id',
        comment: 'Branch this flavor belongs to'
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    // Invalid fields removed
}, {
    tableName: 'flavors',
    timestamps: true,
    paranoid: true
});

module.exports = Flavor;
