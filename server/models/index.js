const sequelize = require('../config/database');
const User = require('./User');
const Institution = require('./Institution');
const Student = require('./Student');
const VerificationLog = require('./VerificationLog');

// Define associations
User.hasOne(Institution, { foreignKey: 'userId' });
Institution.belongsTo(User, { foreignKey: 'userId' });

Institution.hasMany(Student, { foreignKey: 'institutionId' });
Student.belongsTo(Institution, { foreignKey: 'institutionId' });

module.exports = {
  sequelize,
  User,
  Institution,
  Student,
  VerificationLog,
};