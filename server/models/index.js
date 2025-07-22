const sequelize = require('../config/database');
const User = require('./User');
const Institution = require('./Institution');
const Student = require('./Student');
const VerificationLog = require('./VerificationLog');
const Credit = require('./Credit');
const Payment = require('./Payment');
const Announcement = require('./Announcement');
const Feedback = require('./Feedback');

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

User.hasMany(Announcement, { foreignKey: 'createdBy' });
Announcement.belongsTo(User, { foreignKey: 'createdBy' });

Institution.hasOne(Announcement, { foreignKey: 'targetInstitutionId' });
Announcement.belongsTo(Institution, { foreignKey: 'targetInstitutionId' });

Institution.hasMany(Feedback, { foreignKey: 'institutionId' });
Feedback.belongsTo(Institution, { foreignKey: 'institutionId' });

Announcement.hasMany(Feedback, { foreignKey: 'announcementId' });
Feedback.belongsTo(Announcement, { foreignKey: 'announcementId' });

User.hasMany(Feedback, { foreignKey: 'respondedBy' });
Feedback.belongsTo(User, { foreignKey: 'respondedBy', as: 'Responder' });
module.exports = {
  sequelize,
  User,
  Institution,
  Student,
  VerificationLog,
  Credit,
  Payment,
  Announcement,
  Feedback,
};