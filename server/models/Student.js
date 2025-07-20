const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  yearOfEntry: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  yearOfGraduation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  classOfDegree: {
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
  institutionId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Institutions',
      key: 'id',
    },
  },
});

module.exports = Student;