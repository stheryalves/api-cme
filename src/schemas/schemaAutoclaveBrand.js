const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const AutoclaveBrand = sequelize.define('marcaAutoclave', {
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
    tableName: 'marcaAutoclave',
    timestamps: true
});

AutoclaveBrand.sync();

module.exports = AutoclaveBrand;