const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
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
  announcementId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Announcements',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('feedback', 'complaint', 'suggestion', 'inquiry'),
    allowNull: false,
    defaultValue: 'feedback',
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'resolved', 'closed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  adminResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  respondedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Feedback;