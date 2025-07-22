const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationLog = sequelize.define('VerificationLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.FLOAT, // or DECIMAL
    allowNull: false,
    defaultValue: 0,
  },
  institutionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Institutions',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  certificateNumber: {
    type: DataTypes.STRING,
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
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
// Example for Student.js
VerificationLog.associate = function(models) {
  VerificationLog.belongsTo(models.Institution, { foreignKey: 'institutionId' });
};


module.exports = VerificationLog;
