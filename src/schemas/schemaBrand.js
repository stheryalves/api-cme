const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Brand = sequelize.define('brand', {
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
    tableName: 'brands',
    timestamps: true
});

Brand.sync();

module.exports = Brand;