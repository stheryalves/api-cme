const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Brand = require('./schemaBrand');

const Autoclave = sequelize.define('autoclave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    modeloAutoclave: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    volumeTotCamaraLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    volumeUtilCamaraLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medTotTempoCicloATMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoCargaDescargaMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoClicloCarDescMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoTestDiarioBDMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoDiarioAquecimentoMaqMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    marcaAutoclave: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Brand,
            key: 'id'
        }
    }
}, {
    tableName: 'autoclave',
    timestamps: true,
});

Autoclave.sync();

module.exports = Autoclave;