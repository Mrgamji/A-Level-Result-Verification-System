const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Institution = sequelize.define('Institution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  accreditationId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  institutionType: {
    type: DataTypes.ENUM('private', 'public'),
    allowNull: false,
  },
  subType: {
    type: DataTypes.ENUM('federal', 'state'),
    allowNull: true,
  },
  deskOfficerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  accessCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = Institution;