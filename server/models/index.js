const sequelize = require('../config/database');
const User = require('./User');
const Institution = require('./Institution');
const Student = require('./Student');
const VerificationLog = require('./VerificationLog');
const Credit = require('./Credit');
const Payment = require('./Payment');

// Define associations
User.hasOne(Institution, { foreignKey: 'userId' });
Institution.belongsTo(User, { foreignKey: 'userId' });

Institution.hasMany(Student, { foreignKey: 'institutionId' });
Student.belongsTo(Institution, { foreignKey: 'institutionId' });

Institution.hasMany(Credit, { foreignKey: 'institutionId' });
Credit.belongsTo(Institution, { foreignKey: 'institutionId' });

Institution.hasMany(Payment, { foreignKey: 'institutionId' });
Payment.belongsTo(Institution, { foreignKey: 'institutionId' });

Institution.hasMany(VerificationLog, { foreignKey: 'institutionId' });
VerificationLog.belongsTo(Institution, { foreignKey: 'institutionId' });

module.exports = {
  sequelize,
  User,
  Institution,
  Student,
  VerificationLog,
  Credit,
  Payment,
};