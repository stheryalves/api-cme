const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Lead = require('./schemaLead');

const LeadCalcWasher = sequelize.define('calculos_lavadora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numCiclosInstrumentosDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempProcessamDemandaInstrumentosMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    qtdTraqueiasDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTraqueiasUtiDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTotTraqueiasDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdCiclosAssistVentDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    demandaCiclosDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempProcessamDemandaAssistVentMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    demandaTempoDiaMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    minutosDisponiveisTodosEquipamDia: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    percentualUtilizacaoCapacidadeMax: {
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
    tableName: 'calculos_lavadora',
    timestamps: true,
});

LeadCalcWasher.sync({ alter: true });

module.exports = LeadCalcWasher;