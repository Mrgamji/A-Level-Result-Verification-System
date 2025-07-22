const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const sequelize = require('../config/database');
const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelModule = require(path.join(__dirname, file));
    
    // Handle different model export styles
    let model;
    if (typeof modelModule === 'function') {
      // Factory function style (most common)
      model = modelModule(sequelize, Sequelize.DataTypes);
    } else if (modelModule.default && typeof modelModule.default === 'function') {
      // ES6 default export style
      model = modelModule.default(sequelize, Sequelize.DataTypes);
    } else {
      // Direct model instance (less common)
      model = modelModule;
    }
    
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;