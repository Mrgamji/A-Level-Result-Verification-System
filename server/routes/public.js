const express = require('express');
const crypto = require('crypto');
const sendMail = require('../utility/mailer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { PublicToken, PublicVerification, Student, Institution } = require('../models');

const router = express.Router();

const TOKEN_PRICE = 500; // N500 per token

// Generate unique token code
const generateTokenCode = () => {
  return `PUB-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// Purchase verification token
router.post('/purchase-token', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('purpose').isIn(['employment', 'admission', 'scholarship', 'verification', 'other']).withMessage('Valid purpose is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phoneNumber, fullName, organization, purpose } = req.body;

    // Generate token code and payment reference
    const tokenCode = generateTokenCode();
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create token record
    const token = await PublicToken.create({
      tokenCode,
      email,
      phoneNumber,
      fullName,
      organization: organization || null,
      purpose,
      amount: TOKEN_PRICE,
      paymentReference,
      expiresAt,
      status: 'pending'
    });

    // Send email with token details (simulate payment success for demo)
    await sendMail({
      to: email,
      subject: '🎫 Your A-Level Verification Token Purchase',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 40px 0;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); padding: 32px 0; text-align: center;">
              <img src="https://img.icons8.com/color/96/000000/verified-badge.png" alt="Verification" style="width: 64px; height: 64px; margin-bottom: 12px;" />
              <h1 style="color: #fff; margin: 0; font-size: 2rem; font-weight: 700;">Token Purchased Successfully</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #2563eb; margin-top: 0;">Hello ${fullName},</h2>
              <p style="font-size: 1.1rem; color: #222; margin-bottom: 18px;">
                Your verification token has been successfully purchased and is ready to use.
              </p>
              <div style="background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 24px 0;">
                <p style="margin: 0; color: #2563eb; font-size: 1rem;">
                  <strong>Your Verification Token</strong>
                </p>
                <div style="font-family: 'Courier New', monospace; font-size: 1.5rem; font-weight: 700; color: #2563eb; text-align: center; margin: 12px 0; padding: 12px; background: #fff; border-radius: 6px; border: 2px dashed #2563eb;">
                  ${tokenCode}
                </div>
                <p style="margin: 8px 0 0 0; color: #666; font-size: 0.9rem;">
                  <strong>Amount Paid:</strong> ₦${TOKEN_PRICE}<br>
                  <strong>Valid Until:</strong> ${expiresAt.toLocaleDateString()}<br>
                  <strong>Purpose:</strong> ${purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                </p>
              </div>
              <p style="font-size: 1rem; color: #444; margin-bottom: 18px;">
                Use this token to verify any A-Level certificate on our platform. The token is valid for 30 days from the purchase date.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/public-verify" style="background: #2563eb; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 1.1rem; font-weight: 600; display: inline-block;">
                  Verify Certificate Now
                </a>
              </div>
              <p style="color: #666; font-size: 0.97rem; margin-bottom: 0;">
                Best regards,<br>
                <span style="color: #2563eb; font-weight: 600;">A Level Verification System Team</span>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    // Simulate payment success (in production, integrate with payment gateway)
    setTimeout(async () => {
      await token.update({ status: 'active' });
    }, 1000);

    res.status(201).json({
      success: true,
      message: 'Token purchased successfully',
      tokenCode,
      amount: TOKEN_PRICE,
      expiresAt,
      paymentReference
    });

  } catch (error) {
    console.error('Token purchase error:', error);
    res.status(500).json({ error: 'Failed to purchase token' });
  }
});

// Verify certificate with token
router.post('/verify-certificate', [
  body('tokenCode').notEmpty().withMessage('Token code is required'),
  body('certificateNumber').notEmpty().withMessage('Certificate number is required'),
  body('certificateType').isIn([
    'IJMB', 'JUPEB', 'NCE', 'OND', 'HND', 'PGD', 'PGDE',
    'A-Level WAEC (GCE)', 'Cambridge A-Level', 'NABTEB A-Level',
    'NBTE (Pre-ND)', 'Other Nigerian A-Level Results'
  ]).withMessage('Valid certificate type is required'),
  body('yearOfGraduation').isInt({ min: 1950, max: new Date().getFullYear() }).withMessage('Valid graduation year is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tokenCode, certificateNumber, certificateType, yearOfGraduation } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Find and validate token
    const token = await PublicToken.findOne({ where: { tokenCode } });
    
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Invalid token code'
      });
    }

    if (token.status === 'used') {
      return res.status(400).json({
        success: false,
        error: 'Token has already been used'
      });
    }

    if (token.status === 'expired' || new Date() > token.expiresAt) {
      return res.status(400).json({
        success: false,
        error: 'Token has expired'
      });
    }

    if (token.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Token is not active'
      });
    }

    // Search for student certificate
    const student = await Student.findOne({
      where: {
        certificateNumber,
        certificateType,
        yearOfGraduation: parseInt(yearOfGraduation)
      },
      include: [{ model: Institution }]
    });

    // Mark token as used
    if(student)
      {await token.update({
      status: 'used',
      usedAt: new Date()
    });}

    // Log verification attempt
    await PublicVerification.create({
      tokenId: token.id,
      certificateNumber,
      certificateType,
      yearOfGraduation: parseInt(yearOfGraduation),
      ipAddress,
      success: !!student,
      studentData: student ? {
        fullName: student.fullName,
        institution: student.Institution.name,
        department: student.department,
        classOfDegree: student.classOfDegree,
        yearOfEntry: student.yearOfEntry
      } : null
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or details do not match our records',
        tokenUsed: true
      });
    }
    // Send a customized email to the user with the certificate file attached

    // Import mailer and path utilities
 

    // Find the user's email from the token (purchase)
    let userEmail = token.email || token.purchaserEmail || null;

    // Compose the certificate file path
    const certFileName = `${student.certificateNumber}.pdf`;
    const certFilePath = path.join(__dirname, '../../uploads/certificates', certFileName);

    // Check if the certificate file exists before sending
    if (userEmail && fs.existsSync(certFilePath)) {
      // Compose a very customized HTML email
      const html = `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #006400;">🎉 Congratulations, ${student.fullName}!</h2>
          <p>
            Your certificate verification for <b>${student.certificateType}</b> (${student.certificateNumber}) has been <span style="color:green;font-weight:bold;">successfully completed</span>.
          </p>
          <ul style="margin: 18px 0 18px 0; padding: 0 0 0 18px;">
            <li><b>Full Name:</b> ${student.fullName}</li>
            <li><b>Institution:</b> ${student.Institution.name}</li>
            <li><b>Department:</b> ${student.department}</li>
            <li><b>Class of Degree:</b> ${student.classOfDegree}</li>
            <li><b>Year of Entry:</b> ${student.yearOfEntry}</li>
            <li><b>Year of Graduation:</b> ${student.yearOfGraduation}</li>
            <li><b>Certificate Number:</b> ${student.certificateNumber}</li>
          </ul>
          <p>
            <b>Your official verification certificate is attached to this email as a PDF file.</b>
          </p>
          <p>
            <span style="color:#006400;">Thank you for using the Nigerian A-Level Result Verification System.</span><br>
            <small>
              If you have any questions, reply to this email or contact our support team.<br>
              <i>This is an automated message. Please do not reply directly to this email.</i>
            </small>
          </p>
        </div>
      `;

      // Send the email with attachment
      sendMail({
        to: userEmail,
        subject: `Your Certificate Verification Result - ${student.certificateNumber}`,
        html,
        attachments: [
          {
            filename: certFileName,
            path: certFilePath,
            contentType: 'application/pdf'
          }
        ]
      }).catch(err => {
        // Log but do not block response
        console.error('Failed to send verification email:', err);
      });
    }

    res.json({
      success: true,
      message: 'Certificate verified successfully',
      tokenUsed: true,
      data: {
        fullName: student.fullName,
        institution: student.Institution.name,
        department: student.department,
        certificateNumber: student.certificateNumber,
        certificateType: student.certificateType,
        yearOfEntry: student.yearOfEntry,
        yearOfGraduation: student.yearOfGraduation,
        classOfDegree: student.classOfDegree,
        verificationDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Check token status
router.get('/token-status/:tokenCode', async (req, res) => {
  try {
    const { tokenCode } = req.params;
    
    const token = await PublicToken.findOne({ where: { tokenCode } });
    
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    res.json({
      tokenCode: token.tokenCode,
      status: token.status,
      expiresAt: token.expiresAt,
      usedAt: token.usedAt,
      amount: token.amount
    });

  } catch (error) {
    console.error('Token status error:', error);
    res.status(500).json({ error: 'Failed to check token status' });
  }
});

module.exports = router;