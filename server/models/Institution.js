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
    type: DataTypes.ENUM(
      'private-university',
      'public-university',
      'public-college-of-education',
      'private-college-of-education',
      'public-poly',
      'private-poly',
      'exam-body',
      'others'
    ),
    allowNull: false,
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
// models/Institution.js
module.exports = (sequelize, DataTypes) => {
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
      type: DataTypes.ENUM(
        'private-university',
        'public-university',
        'public-college-of-education',
        'private-college-of-education',
        'public-poly',
        'private-poly',
        'exam-body',
        'others'
      ),
      allowNull: false,
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

  Institution.associate = (models) => {
    Institution.belongsTo(models.User, { foreignKey: 'userId' });
    Institution.hasMany(models.Student, { foreignKey: 'institutionId' });
    Institution.hasMany(models.Announcement, { foreignKey: 'targetInstitutionId' });
    Institution.hasMany(models.Feedback, { foreignKey: 'institutionId' });
    Institution.hasMany(models.Credit, { foreignKey: 'institutionId' });
    Institution.hasMany(models.Payment, { foreignKey: 'institutionId' });
    Institution.hasMany(models.VerificationLog, { foreignKey: 'institutionId' });
  };

  return Institution;
};