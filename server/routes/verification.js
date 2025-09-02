const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { Student, Institution, VerificationLog, Credit } = require('../models');
const { authenticateToken, requireRole, verifyInstitution } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for verification endpoint
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many verification requests, please try again later',
});

// Verify certificate
router.post('/verify', verificationLimiter, authenticateToken, requireRole('institution'), [
  body('certificateNumber').trim().notEmpty().withMessage('Certificate number is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { certificateNumber } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Find institution
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Check if institution has credits
    const credits = await Credit.findAll({
      where: { institutionId: institution.id },
    });

    let totalCredits = 0;
    credits.forEach(credit => {
      if (credit.transactionType === 'purchase') {
        totalCredits += credit.transactionAmount;
      } else if (credit.transactionType === 'usage') {
        totalCredits -= credit.transactionAmount;
      }
    });

    if (totalCredits <= 0) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: 'You need to purchase credits to verify certificates',
        code: 'INSUFFICIENT_CREDITS'
      });
    }

    // Find student with certificate number
    const student = await Student.findOne({
      where: { certificateNumber },
      include: [{ model: Institution }],
    });

    // Deduct credit for verification attempt
    await Credit.create({
      institutionId: institution.id,
      amount: totalCredits - 1,
      transactionType: 'usage',
      transactionAmount: 1,
      description: `Certificate verification: ${certificateNumber}`,
      reference: `VER-${Date.now()}`,
    });

    // Log verification attempt
    await VerificationLog.create({
      institutionId: institution.id,
      amount: 200, // Cost per verification
      certificateNumber,
      ipAddress,
      success: !!student,
    });

    if (!student) {
      return res.status(404).json({
        message: 'Certificate Not Found or Not Verified',
        success: false,
        creditsRemaining: totalCredits - 1,
      });
    }

    res.json({
      message: 'Certificate verified successfully',
      success: true,
      creditsRemaining: totalCredits - 1,
      data: {
        fullName: student.fullName,
        institution: student.Institution.name,
        department: student.department,
        yearOfEntry: student.yearOfEntry,
        yearOfGraduation: student.yearOfGraduation,
        classOfDegree: student.classOfDegree,
        certificateType: student.certificateType,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Improved Bulk Verification Endpoint
router.post("/bulk-verify", verificationLimiter, authenticateToken, requireRole('institution'), [
  body('regNumbers').isArray({ min: 1 }).withMessage('regNumbers must be a non-empty array'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { regNumbers } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Find institution
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Calculate available credits
    const credits = await Credit.findAll({
      where: { institutionId: institution.id },
    });

    let totalCredits = 0;
    credits.forEach(credit => {
      if (credit.transactionType === 'purchase') {
        totalCredits += credit.transactionAmount;
      } else if (credit.transactionType === 'usage') {
        totalCredits -= credit.transactionAmount;
      }
    });

    if (totalCredits < regNumbers.length) {
      return res.status(402).json({
        error: 'Insufficient credits',
        message: `You need ${regNumbers.length} credits, but you have ${totalCredits}`,
        code: 'INSUFFICIENT_CREDITS'
      });
    }

    // Fetch all students in one query for efficiency
    const trimmedRegNumbers = regNumbers.map(r => r.trim());
    const students = await Student.findAll({
      where: { certificateNumber: trimmedRegNumbers },
      include: [{ model: Institution }],
    });

    // Map for quick lookup
    const studentMap = {};
    students.forEach(student => {
      studentMap[student.certificateNumber] = student;
    });

    let results = [];
    let logs = [];
    let creditsToCreate = [];

    for (let reg of trimmedRegNumbers) {
      const student = studentMap[reg];
      let result;
      if (student) {
        result = {
          regNumber: reg,
          success: true,
          data: {
            fullName: student.fullName,
            institution: student.Institution ? student.Institution.name : null,
            department: student.department,
            classOfDegree: student.classOfDegree,
            certificateType: student.certificateType,
            yearOfEntry: student.yearOfEntry,
            yearOfGraduation: student.yearOfGraduation,
            // Add downloadUrl if you have fileUrl or similar
            downloadUrl: student.fileUrl || null,
          },
        };
      } else {
        result = {
          regNumber: reg,
          success: false,
          message: "Certificate not found",
        };
      }
      results.push(result);

      // Prepare credit deduction and log for each attempt
      creditsToCreate.push({
        institutionId: institution.id,
        amount: --totalCredits,
        transactionType: 'usage',
        transactionAmount: 1,
        description: `Bulk certificate verification: ${reg}`,
        reference: `BULK-VER-${Date.now()}-${reg}`,
      });

      logs.push({
        institutionId: institution.id,
        amount: 200, // Cost per verification
        certificateNumber: reg,
        ipAddress,
        success: !!student,
      });
    }

    // Bulk create credits and logs
    await Credit.bulkCreate(creditsToCreate);
    await VerificationLog.bulkCreate(logs);

    return res.json({ results, creditsRemaining: totalCredits });
  } catch (err) {
    console.error('Error during bulk verification:', err);
    return res.status(500).json({ message: "Server error during bulk verification" });
  }
});

module.exports = router;