const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Brand = require('./schemaBrand');

const Autoclave = sequelize.define('autoclave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    autoclaveModelName: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    totalChamberVolumeLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usefulChamberVolumeLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    averageTotalCycleTimeHTMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    loadingAndUnloadingTimeMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cycleTimeMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dailyTimeBDTestMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dailyTimeWarmUpMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_brand: {
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