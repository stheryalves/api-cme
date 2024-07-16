const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");
const Lead = require("./schemaLead");

const LeadCalcProject = sequelize.define(
  "calculos_projeto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numCirurgiasDia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    volumeTotalDiarioCirurgias: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    volumeTotalDiarioUTIs: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    volumeTotalDiarioInternacao: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    estimativaVolumeTotalDiárioMaterial: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    estimativaVolumeTotalDiarioInstrumentalUE: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    estimativaVolumeTotalDiarioInstrumentalLt: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    lead: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lead,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "calculos_projeto",
    timestamps: true,
  }
);

module.exports = LeadCalcProject;
