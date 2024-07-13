const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const AutoclaveBrand = require('./schemaAutoclaveBrand');

const Autoclave = sequelize.define('autoclave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marcaAutoclave: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AutoclaveBrand,
            key: 'id'
        }
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
        allowNull: true,
        defaultValue: 0
    },
    tempoTestDiarioBDMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoDiarioAquecimentoMaqMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoDisponivelDiarioMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    producaoHospitalVolDiarioMaterialLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    volumeProcessadoIntervaloPicoLt90totDiario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    intervaloDiarioPicoMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numMaxCiclosDia: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    numMaxCiclosIntervaloPico: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    aproveitamentoCamaraPorcent: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    numAutoclaves: { // quem preenche é o dono do negocio - colocar os campo NN como obrigatorios na dashboard
        type: DataTypes.INTEGER, // preciso desse preenchimento para executar outras contas e popular o banco se 
        allowNull: true, // entrarem marcas novas de autoclaves e lavadoras
        defaultValue: 0
    },
    numAutoclavesUmaEmManutencao: { // quem preenche é o dono do negocio - colocar os campo NN como obrigatorios na dashboard
        type: DataTypes.INTEGER, // preciso desse preenchimento para executar outras contas e popular o banco se 
        allowNull: true, // entrarem marcas novas de autoclaves e lavadoras
        defaultValue: 0
    },
    capProcessamIntervaloPicoTodasAutoclavesOnLt: {
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
    preco: {
        type: DataTypes.FLOAT, // se for faixa de preço mudar para string
        allowNull: true,
        defaultValue: 0.0
    },

}, {
    tableName: 'autoclave',
    timestamps: true,
});

Autoclave.sync();

module.exports = Autoclave;