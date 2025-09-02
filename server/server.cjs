const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve the /uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/students', require('./routes/students'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/public', require('./routes/public'));

// Remove force: true sync (no more dropping tables)
// Instead, check if the database exists, then skip sync if it does
const { Sequelize } = require('sequelize');

async function databaseExists(sequelizeInstance) {
  // This function assumes a Postgres or MySQL database
  // For SQLite, the file existence is enough
  const config = sequelizeInstance.config;
  let dbName = config.database;
  let dialect = config.dialect;

  if (dialect === 'sqlite') {
    // For SQLite, check if file exists
    const fs = require('fs');
    if (dbName === ':memory:') return false;
    return fs.existsSync(dbName);
  } else if (dialect === 'postgres') {
    // For Postgres, connect to default db and check
    const { username, password, host, port } = config;
    const defaultDb = 'postgres';
    const tempSequelize = new Sequelize(defaultDb, username, password, {
      host,
      port,
      dialect: 'postgres',
      logging: false,
    });
    try {
      const [results] = await tempSequelize.query(
        `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
      );
      await tempSequelize.close();
      return results.length > 0;
    } catch (err) {
      await tempSequelize.close();
      return false;
    }
  } else if (dialect === 'mysql' || dialect === 'mariadb') {
    // For MySQL/MariaDB, connect to default db and check
    const { username, password, host, port } = config;
    const defaultDb = 'mysql';
    const tempSequelize = new Sequelize(defaultDb, username, password, {
      host,
      port,
      dialect,
      logging: false,
    });
    try {
      const [results] = await tempSequelize.query(
        `SHOW DATABASES LIKE '${dbName}'`
      );
      await tempSequelize.close();
      return results.length > 0;
    } catch (err) {
      await tempSequelize.close();
      return false;
    }
  }
  // Default: assume not exists
  return false;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    let skipSync = false;
    try {
      skipSync = await databaseExists(sequelize);
    } catch (err) {
      console.error('Error checking database existence:', err);
    }

    if (skipSync) {
      console.log('Database already exists, skipping sync.');
    } else {
      await sequelize.sync({ force: false });
      console.log('Database synced (created new tables).');
    }

    // Optional: Create admin user if not exists
    const { User } = require('./models');
    const bcrypt = require('bcryptjs');

    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@system.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created: admin@system.com / admin123');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();