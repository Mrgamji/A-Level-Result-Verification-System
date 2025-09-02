const express = require('express');
const { Sequelize, Op, fn, col, literal } = require('sequelize');
const bcrypt = require('bcryptjs');
const sendMail = require('../utility/mailer');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Institution, Student, VerificationLog } = require('../models');
const { authenticateToken, requireRole, JWT_SECRET } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { PublicVerification, PublicToken } = require('../models');

// Get verifications by institution (SQLite compatible)
router.get('/chart/verifications-by-institution', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const results = await VerificationLog.findAll({
      attributes: [
        [fn('COUNT', col('id')), 'count'],
        [col('Institution.name'), 'institution']
      ],
      include: [{
        model: Institution,
        attributes: [],
        required: true
      }],
      group: ['Institution.name'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch verification data' });
  }
});

// Get verification success rate (SQLite compatible)
router.get('/chart/success-rate', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    // First ensure the status column exists
    const tableInfo = await db.query("PRAGMA table_info(VerificationLogs)");
    const hasStatusColumn = tableInfo[0].some(col => col.name === 'status');
    
    if (!hasStatusColumn) {
      return res.status(400).json({ 
        error: 'Status column not found in VerificationLogs table',
        solution: 'Run database migration to add status column'
      });
    }

    const results = await VerificationLog.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'value']
      ],
      group: ['status'],
      raw: true
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch success rate data' });
  }
});

// Get verifications over time (SQLite compatible)
router.get('/chart/verifications-over-time', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    // SQLite doesn't support INTERVAL syntax, so we calculate the date in JS
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await VerificationLog.findAll({
      attributes: [
        [fn('date', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [fn('date', col('created_at'))],
      order: [[fn('date', col('created_at')), 'ASC']],
      raw: true
    });

    const formattedData = results.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: row.count
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch timeline data' });
  }
});

// Get public verification logs
router.get('/public-verifications', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const verifications = await PublicVerification.findAll({
      include: [{
        model: PublicToken,
        attributes: ['tokenCode', 'email', 'fullName', 'organization', 'purpose']
      }],
      order: [['created_at', 'DESC']],
      limit: 100
    });

    res.json(verifications);
  } catch (error) {
    console.error('Error fetching public verifications:', error);
    res.status(500).json({ error: 'Failed to fetch public verifications' });
  }
});

// Get public verification stats
router.get('/public-verification-stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const [
      totalVerifications,
      successfulVerifications,
      totalTokensSold,
      totalRevenue
    ] = await Promise.all([
      PublicVerification.count(),
      PublicVerification.count({ where: { success: true } }),
      PublicToken.count({ where: { status: 'used' } }),
      PublicToken.sum('amount', { where: { status: 'used' } }) || 0
    ]);

    res.json({
      totalVerifications,
      successfulVerifications,
      failedVerifications: totalVerifications - successfulVerifications,
      totalTokensSold,
      totalRevenue,
      successRate: totalVerifications > 0 ? ((successfulVerifications / totalVerifications) * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Error fetching public verification stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.post('/login', [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array().map(err => ({
          param: err.param,
          message: err.msg
        }))
      });
    }

    const { email, password } = req.body;

    // Find admin user with strict role check
    const user = await User.findOne({
      where: { 
        email,
        role: 'admin' // Ensure only admin can login through this route
      },
      attributes: ['id', 'email', 'role', 'password']
    });

    // Generic error message for security
    const invalidCredentials = {
      success: false,
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    };

    if (!user) {
      return res.status(401).json(invalidCredentials);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(invalidCredentials);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role,
        type: 'admin' // Explicit type for middleware
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' } // Shorter expiration for admin
    );

    // Remove password before sending user data
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Successful response
    res.json({
      success: true,
      token,
      user: userData,
      redirectTo: '/admin/dashboard'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
});

router.get('/dashboard-stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const [
      totalInstitutions,
      totalPendingInstitutions,
      totalApprovedInstitutions,
      totalStudents,
      totalVerifications,
      totalRevenue
    ] = await Promise.all([
      Institution.count(),
      Institution.count({ where: { status: 'pending' } }),
      Institution.count({ where: { status: 'approved' } }),
      Student.count(),
      VerificationLog.count(),
      VerificationLog.sum('amount', {
        where: {
          amount: { [Op.not]: null }
        }
      }) || 0 // Ensure default value
    ]);

    res.json({
      success: true,
      data: {
        institutions: {
          total: totalInstitutions || 0,
          pending: totalPendingInstitutions || 0,
          approved: totalApprovedInstitutions || 0,
        },
        students: totalStudents || 0,
        verifications: totalVerifications || 0,
        revenue: totalRevenue || 0,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to load dashboard data',
      code: 'DASHBOARD_ERROR',
    });
  }
});
router.get('/admin/verification-trends', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const range = req.query.range || '30days';
    const now = new Date();
    let startDate;

    switch (range) {
      case '7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '90days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '12months':
        startDate = new Date(now.setMonth(now.getMonth() - 12));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const logs = await VerificationLog.findAll({
      where: { timestamp: { [Op.gte]: startDate } },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'verifications']
      ],
      group: ['date'],
      order: [['date', 'ASC']]
    });

    const trends = logs.map(log => ({
      date: log.getDataValue('date'),
      verifications: parseInt(log.getDataValue('verifications'), 10),
      students: Math.floor(Math.random() * 200) + 50 // optional or replace with real data
    }));

    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Trend data fetch failed' });
  }
});

// Get all students (for admin)
router.get('/students', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    // Get all students, including their institution and upload date
    const students = await Student.findAll({
      include: [
        {
          model: Institution,
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Map to shape expected by frontend
    const result = students.map((student) => ({
      id: student.id,
      fullName: student.fullName,
      yearOfGraduation: student.yearOfGraduation,
      institution: student.Institution ? student.Institution.name : '',
      uploadDate: student.created_at ? student.created_at.toISOString().slice(0, 10) : '',
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all institutions
router.get('/institutions', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const institutions = await Institution.findAll({
      include: [{ model: User, attributes: ['email'] }],
      order: [['created_at', 'DESC']],
    });

    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve/reject institution
router.put('/institutions/:id/status', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const institution = await Institution.findByPk(id);
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // If approving, create user account
    if (status === 'approved' && !institution.userId) {
      // Generate access code and temporary password
      const accessCode = `INST-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(-4).toUpperCase()}`;
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      // Create user account
      const user = await User.create({
        email: `${accessCode}@system.internal`,
        password: hashedPassword,
        role: 'institution',
      });
      
      // Update institution with user ID and access code
      institution.userId = user.id;
      institution.accessCode = accessCode;
      
      // TODO: Send email with login credentials
     

      await sendMail({
        to: institution.email,
        subject: '🎉 Your Institution Account Has Been Approved!',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 40px 0;">
            <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); padding: 32px 0; text-align: center;">
                <img src="https://img.icons8.com/color/96/000000/verified-badge.png" alt="Verification" style="width: 64px; height: 64px; margin-bottom: 12px;" />
                <h1 style="color: #fff; margin: 0; font-size: 2rem; font-weight: 700;">Account Approved</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #2563eb; margin-top: 0;">Hello ${institution.name},</h2>
                <p style="font-size: 1.1rem; color: #222; margin-bottom: 18px;">
                  Congratulations! Your institution account has been <strong>approved</strong> on the <strong>A-Level Result Verification System</strong>.
                </p>
                <div style="background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 24px 0;">
                  <p style="margin: 0; color: #2563eb; font-size: 1rem;">
                    <strong>Login Credentials</strong>
                  </p>
                  <ul style="list-style: none; padding: 0; margin: 12px 0 0 0;">
                    <li style="margin-bottom: 8px;">
                      <span style="color: #222;">Access Code:</span>
                      <span style="font-weight: 600; color: #2563eb;">${accessCode}</span>
                    </li>
                    <li>
                      <span style="color: #222;">Temporary Password:</span>
                      <span style="font-weight: 600; color: #2563eb;">${tempPassword}</span>
                    </li>
                  </ul>
                </div>
                <p style="font-size: 1rem; color: #444; margin-bottom: 18px;">
                  Please use the credentials above to log in to your institution dashboard. For security, you will be prompted to change your password after your first login.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="http://your-app-url.com/login" style="background: #2563eb; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 1.1rem; font-weight: 600; display: inline-block; box-shadow: 0 2px 8px rgba(37,99,235,0.08); transition: background 0.2s;">
                    Login to Dashboard
                  </a>
                </div>
                <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #2563eb; font-size: 0.98rem;">
                    <strong>Need help?</strong> <br>
                    If you have any questions, please contact us at <a href="mailto:alevel@jamb.edu.ng" style="color: #2563eb; text-decoration: underline;">alevel@jamb.edu.ng</a>.
                  </p>
                </div>
                <p style="color: #666; font-size: 0.97rem; margin-bottom: 0;">
                  Best regards,<br>
                  <span style="color: #2563eb; font-weight: 600;">A Level Verification System Team</span><br>
                  <span style="font-size: 0.95rem;">Joint Admissions and Matriculation Board (JAMB)</span>
                </p>
              </div>
              <div style="background: #f1f5f9; text-align: center; padding: 16px; color: #888; font-size: 0.95rem;">
                &copy; ${new Date().getFullYear()} A Level Verification System &mdash; JAMB
              </div>
            </div>
          </div>
        `,
      });
      console.log(`Institution approved: ${institution.name}`);
      console.log(`Access Code: ${accessCode}`);
      console.log(`Password: ${tempPassword}`);
      console.log(`Send to: ${institution.email}`);
    }

    institution.status = status;
    await institution.save();

    res.json({ message: `Institution ${status} successfully` });
  } catch (error) {
    console.error('Error updating institution status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/logs', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const logs = await VerificationLog.findAll({
      include: [{
        model: Institution,
        attributes: ['name'], // Only select institution name
      }],
      order: [['timestamp', 'DESC']]
    });
    console.log(logs);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Change password for admin
router.put('/change-password', authenticateToken, requireRole('admin'), [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Find admin user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedNewPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to change password'
    });
  }
});

module.exports = router;