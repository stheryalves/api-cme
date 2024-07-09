const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Brand = require('./schemaBrand');

const Washer = sequelize.define('lavadora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marcaLavadora: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Brand,
            key: 'id'
        }
    },
    modeloLavadora: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    volumeTotalCamaraLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeCargaBandejasInstrumentos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeCargaTraqueias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempMedCicloInstrumentosCargaMaxMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempMedCicloAssisVentCargaMaxMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    producaoUeInstrumentosDia: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    numCirurgiasDia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numLeitosUti: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numBandejasPorUe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeProcessamUeCargaInstrumentos: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    numCiclosInstrumentosDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    intervaloMedEntreCiclos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempProcessamDemandaInstrumentosMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    qtdTraqueiasCirurgia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qtdTraqueiasDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTraqueiasLeitoUtiDia: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tempProcessamDemandaAssistVentMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    demandaCiclosDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    demandaTempoDiaMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    quantidadeTermosProjeto: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    preco: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },

}, {
    tableName: 'lavadora',
    timestamps: true,
});

Washer.sync();

module.exports = Washer;