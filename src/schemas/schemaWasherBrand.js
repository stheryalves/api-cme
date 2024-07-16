const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const WasherBrand = sequelize.define('marcaLavadora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeMarca: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
}, {
    tableName: 'marcaLavadora',
    timestamps: true
});

WasherBrand.sync();

module.exports = WasherBrand;