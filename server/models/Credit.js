const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Credit = sequelize.define('Credit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  institutionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Institutions',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  transactionType: {
    type: DataTypes.ENUM('purchase', 'usage', 'refund'),
    allowNull: false,
  },
  transactionAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Credit;