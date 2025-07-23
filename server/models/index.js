const sequelize = require('../config/database');
const User = require('./User');
const Institution = require('./Institution');
const Student = require('./Student');
const VerificationLog = require('./VerificationLog');
const Credit = require('./Credit');
const Payment = require('./Payment');
const Announcement = require('./Announcement');
const Feedback = require('./Feedback');
const PublicToken = require('./PublicToken');
const PublicVerification = require('./PublicVerification');

// ========== Associations ========== //

// USER -> INSTITUTION
User.hasOne(Institution, { foreignKey: 'userId' });
Institution.belongsTo(User, { foreignKey: 'userId' });

// INSTITUTION -> STUDENTS
Institution.hasMany(Student, { foreignKey: 'institutionId' });
Student.belongsTo(Institution, { foreignKey: 'institutionId' });

// INSTITUTION -> CREDITS
Institution.hasMany(Credit, { foreignKey: 'institutionId' });
Credit.belongsTo(Institution, { foreignKey: 'institutionId' });

// INSTITUTION -> PAYMENTS
Institution.hasMany(Payment, { foreignKey: 'institutionId' });
Payment.belongsTo(Institution, { foreignKey: 'institutionId' });

// INSTITUTION -> VERIFICATION LOGS
Institution.hasMany(VerificationLog, { foreignKey: 'institutionId' });
VerificationLog.belongsTo(Institution, { foreignKey: 'institutionId' });

// USER -> ANNOUNCEMENTS (Created by)
User.hasMany(Announcement, { foreignKey: 'createdBy' });
Announcement.belongsTo(User, { foreignKey: 'createdBy' });

// INSTITUTION -> ANNOUNCEMENTS (Target)
Institution.hasOne(Announcement, { foreignKey: 'targetInstitutionId' });
Announcement.belongsTo(Institution, { foreignKey: 'targetInstitutionId' });

// INSTITUTION -> FEEDBACK
Institution.hasMany(Feedback, { foreignKey: 'institutionId' });
Feedback.belongsTo(Institution, { foreignKey: 'institutionId' });

// ANNOUNCEMENT -> FEEDBACK
Announcement.hasMany(Feedback, { foreignKey: 'announcementId' });
Feedback.belongsTo(Announcement, { foreignKey: 'announcementId' });

// USER -> FEEDBACK (Responded By)
User.hasMany(Feedback, { foreignKey: 'respondedBy' });
Feedback.belongsTo(User, { foreignKey: 'respondedBy', as: 'Responder' });

// PUBLIC TOKEN -> PUBLIC VERIFICATION
PublicToken.hasMany(PublicVerification, { foreignKey: 'tokenId' });
PublicVerification.belongsTo(PublicToken, { foreignKey: 'tokenId' });

// Export models and sequelize
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
  PublicToken,
  PublicVerification,
};
