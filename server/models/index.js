const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Institution = require('./Institution');
const Student = require('./Student');
const VerificationLog = require('./VerificationLog');
const Credit = require('./Credit');
const Payment = require('./Payment');

// Collect all models
const models = {
  User,
  Institution,
  Student,
  VerificationLog,
  Credit,
  Payment,
  sequelize,
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;