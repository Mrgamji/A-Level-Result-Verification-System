const express = require('express');
const bcrypt = require('bcryptjs');
const sendMail = require('../utility/mailer');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Institution } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Activate institution request
router.post('/activate-institution', [
  body('institutionName').trim().notEmpty().withMessage('Institution name is required'),
  body('schoolEmail').isEmail().withMessage('Valid school email is required'),
  body('accreditationId').trim().notEmpty().withMessage('Accreditation ID is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('institutionType').isIn(['private', 'public']).withMessage('Valid institution type is required'),
  body('deskOfficerPhone').trim().notEmpty().withMessage('Desk officer phone is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      institutionName, 
      schoolEmail, 
      accreditationId, 
      address, 
      institutionType,
      subType,
      deskOfficerPhone,
    } = req.body;

    // Defensive: check Institution and sequelize are defined
    if (!Institution) {
      return res.status(500).json({ error: 'Institution model not available' });
    }
    let sequelize;
    try {
      sequelize = require('sequelize');
    } catch (e) {
      return res.status(500).json({ error: 'Sequelize not available' });
    }

    // Check if institution already exists
    let existingInstitution;
    try {
      existingInstitution = await Institution.findOne({ 
        where: { 
          [sequelize.Op.or]: [
            { email: schoolEmail },
            { accreditationId: accreditationId }
          ]
        } 
      });
    } catch (err) {
      console.error('DB error on findOne:', err);
      return res.status(500).json({ error: 'Database error while checking for existing institution' });
    }

    if (existingInstitution) {
      return res.status(400).json({ error: 'Institution already exists with this email or accreditation ID' });
    }

    // Create institution activation request
    let institution;
    try {
      institution = await Institution.create({
        name: institutionName,
        email: schoolEmail,
        accreditationId,
        address,
        institutionType,
        subType: institutionType === 'public' ? subType : null,
        deskOfficerPhone,
        status: 'pending',
      });
    } catch (err) {
      console.error('DB error on create:', err);
      return res.status(500).json({ error: 'Database error while creating institution' });
    }

    if (!institution) {
      return res.status(500).json({ error: 'Failed to create institution activation request' });
    }

    await sendMail({
      to: institution.email,
      subject: '🎉 Your Institution Activation Request Has Been Received!',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 40px 0;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); padding: 32px 0; text-align: center;">
              <img src="https://img.icons8.com/color/96/000000/verified-badge.png" alt="Verification" style="width: 64px; height: 64px; margin-bottom: 12px;" />
              <h1 style="color: #fff; margin: 0; font-size: 2rem; font-weight: 700;">Activation Request Received</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #2563eb; margin-top: 0;">Hello ${institution.name},</h2>
              <p style="font-size: 1.1rem; color: #222; margin-bottom: 18px;">
                Thank you for submitting your institution's activation request to the <strong>A-Level Result Verification System</strong>.
              </p>
              <p style="font-size: 1rem; color: #444; margin-bottom: 18px;">
                <span style="color: #2563eb; font-weight: 600;">What's next?</span><br>
                Our team will review your request and verify your details. Once your institution is approved, you will receive an email with your login credentials and further instructions.
              </p>
              <div style="background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 24px 0;">
                <p style="margin: 0; color: #2563eb; font-size: 1rem;">
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
    res.status(201).json({
      message: 'Institution activation request submitted successfully. You will receive login credentials via email once approved.',
      institutionId: institution.id,
    });
  } catch (error) {
    console.error('Activation request error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});



//Login
router.post('/login', [
  body('accessCode')
    .trim()
    .notEmpty().withMessage('Institution access code is required')
    .isLength({ min: 6 }).withMessage('Access code must be at least 6 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
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
    
    const { accessCode, password } = req.body;

    // Find institution with user in a single query
    const institution = await Institution.findOne({
      where: { accessCode },
      include: {
        model: User,
        required: true,
        attributes: ['id', 'password', 'role']
      },
      attributes: ['id', 'name', 'email', 'accessCode', 'status']
    });
    
    // Generic error message for security (don't reveal if access code exists)
    const invalidCredentials = {
      success: false,
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    };

    if (!institution) {
      return res.status(401).json(invalidCredentials);
    }

    // Check institution status
    if (institution.status !== 'approved') {
      return res.status(403).json({
        success: false,
        error: 'Institution not approved',
        message: 'Your institution registration is pending admin approval',
        code: 'INSTITUTION_PENDING'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, institution.User.password);
    if (!isValidPassword) {
      return res.status(401).json(invalidCredentials);
    }

    // Generate JWT token with institution context
    const token = jwt.sign(
      { 
        id: institution.User.id,
        institutionId: institution.id,
        role: institution.User.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' } // Shorter expiration for security
    );

    // Successful response
    res.json({
      success: true,
      token, // Consistent field name
      user: {
        id: institution.User.id,
        email: institution.email,
        institutionName: institution.name,
        accessCode: institution.accessCode,
        role: institution.User.role
      },
      redirectTo: '/institution/dashboard'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
});

module.exports = router;