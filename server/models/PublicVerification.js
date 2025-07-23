const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PublicVerification = sequelize.define('PublicVerification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PublicTokens',
      key: 'id',
    },
  },
  certificateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificateType: {
    type: DataTypes.ENUM(
      'IJMB',
      'JUPEB', 
      'NCE',
      'OND',
      'HND',
      'PGD',
      'PGDE',
      'A-Level WAEC (GCE)',
      'Cambridge A-Level',
      'NABTEB A-Level',
      'NBTE (Pre-ND)',
      'Other Nigerian A-Level Results'
    ),
    allowNull: false,
  },
  yearOfGraduation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  studentData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = PublicVerification;