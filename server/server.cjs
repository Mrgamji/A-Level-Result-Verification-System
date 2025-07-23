const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');


const app = express();
const PORT = process.env.PORT || 10000;

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

sequelize.sync({ force: true }) // ⬅️ This drops and recreates all tables
  .then(() => {
    console.log("Database synced with force: true");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
    
    // Create admin user if not exists
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