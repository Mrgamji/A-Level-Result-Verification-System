const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { Student, Institution, VerificationLog } = require('../models');

const router = express.Router();

// Rate limiting for verification endpoint
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many verification requests, please try again later',
});

// Verify certificate
router.post('/verify', verificationLimiter, [
  body('certificateNumber').trim().notEmpty().withMessage('Certificate number is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { certificateNumber } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Find student with certificate number
    const student = await Student.findOne({
      where: { certificateNumber },
      include: [{ model: Institution }],
    });

    // Log verification attempt
    await VerificationLog.create({
      certificateNumber,
      ipAddress,
      success: !!student,
    });

    if (!student) {
      return res.status(404).json({
        message: 'Certificate Not Found or Not Verified',
        success: false,
      });
    }

    res.json({
      message: 'Certificate verified successfully',
      success: true,
      data: {
        fullName: student.fullName,
        institution: student.Institution.name,
        department: student.department,
        yearOfEntry: student.yearOfEntry,
        yearOfGraduation: student.yearOfGraduation,
        classOfDegree: student.classOfDegree,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;