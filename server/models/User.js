// models/User.js
const { DataTypes } = require('sequelize');

// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'institution'),
      allowNull: false,
      defaultValue: 'institution',
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Institution, { foreignKey: 'userId' });
    User.hasMany(models.Announcement, {
      foreignKey: 'createdBy',
      as: 'announcements',
    });
  };

  return User;
};