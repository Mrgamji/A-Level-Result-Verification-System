const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PublicToken = sequelize.define('PublicToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tokenCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purpose: {
    type: DataTypes.ENUM('employment', 'admission', 'scholarship', 'verification', 'other'),
    allowNull: false,
    defaultValue: 'verification',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 500.00,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'used', 'expired'),
    allowNull: false,
    defaultValue: 'pending',
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = PublicToken;