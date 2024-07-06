const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Lead = sequelize.define('lead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    hospitalEmail: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    hospitalName: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    neighborhood: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    needing: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    intervalCMEHour: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberOfSurgery: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberOfSurgeryRoomDay: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberBedUTI: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberBedInter: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberBedRPA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberBedObs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numberBedHospitalDay: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    acceptOneReport: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    acceptContact: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

}, {
    tableName: 'lead',
    timestamps: true,
});

Lead.sync({ alter: true });

module.exports = Lead;