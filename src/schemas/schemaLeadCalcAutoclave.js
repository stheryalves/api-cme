const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Lead = require('./schemaLead');

const LeadCalcAutoclave = sequelize.define('calculos_autoclave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    intervaloDiarioPicoMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numMaxCiclosIntervaloPico: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    capProcessamIntervaloPicoTodasAutoclavesOnLt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    volumeProcessadoIntervaloPicoLt90totDiario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    horasTrabalhoAtenderVolTotalHr: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    capUtilizTodasAutoclavesIntervaloPicoPorcent: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    lead: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lead,
            key: 'id'
        }
    },
}, {
    tableName: 'calculos_autoclave',
    timestamps: true,
});

LeadCalcAutoclave.sync({ alter: true });

module.exports = LeadCalcAutoclave;