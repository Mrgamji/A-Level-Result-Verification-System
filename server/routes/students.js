const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { Student, Institution } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Add single student
router.post('/', authenticateToken, requireRole('institution'), [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('certificateNumber').trim().notEmpty().withMessage('Certificate number is required'),
  body('yearOfEntry').isInt({ min: 1950, max: new Date().getFullYear() }).withMessage('Valid year of entry is required'),
  body('yearOfGraduation').isInt({ min: 1950, max: new Date().getFullYear() }).withMessage('Valid year of graduation is required'),
  body('classOfDegree').trim().notEmpty().withMessage('Class of degree is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find institution
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const studentData = { ...req.body, institutionId: institution.id };
    const student = await Student.create(studentData);

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    console.error('Error adding student:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Certificate number already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload CSV
router.post('/upload-csv', authenticateToken, requireRole('institution'), upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    // Find institution
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        // Validate required fields
        const requiredFields = ['fullName', 'department', 'certificateNumber', 'yearOfEntry', 'yearOfGraduation', 'classOfDegree'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
          errors.push(`Row missing fields: ${missingFields.join(', ')}`);
          return;
        }

        results.push({
          ...data,
          institutionId: institution.id,
        });
      })
      .on('end', async () => {
        try {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          if (errors.length > 0) {
            return res.status(400).json({ errors });
          }

          // Bulk insert students
          const students = await Student.bulkCreate(results, {
            validate: true,
            ignoreDuplicates: true,
          });

          res.json({
            message: `Successfully uploaded ${students.length} students`,
            count: students.length,
          });
        } catch (error) {
          console.error('Error processing CSV:', error);
          res.status(500).json({ error: 'Error processing CSV data' });
        }
      });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Edit a student (update student details)
// Update a student (PUT /api/students/:id)
router.put('/:id', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const { id } = req.params;
    // Find the institution for the logged-in user
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Find the student and ensure they belong to this institution
    const student = await Student.findOne({
      where: {
        id,
        institutionId: institution.id,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Only allow updating certain fields
    const allowedFields = [
      'fullName',
      'department',
      'certificateNumber',
      'certificateType',
      'yearOfEntry',
      'yearOfGraduation',
      'classOfDegree',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await student.update(updates);

    res.json({
      message: 'Student updated successfully',
      student,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a student (DELETE /api/students/:id)
router.delete('/:id', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const { id } = req.params;
    // Find the institution for the logged-in user
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Find the student and ensure they belong to this institution
    const student = await Student.findOne({
      where: {
        id,
        institutionId: institution.id,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await student.destroy();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get dashboard stats for institution (GET /api/students/dashboard-stats)
router.get('/dashboard-stats', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Total students
    const totalStudents = await Student.count({
      where: { institutionId: institution.id },
    });

    // Total verifications, approved, pending
    // Assuming Verification model exists and has status field
    let totalVerifications = 0;
    let totalSpent=0;

    if (typeof Verification !== 'undefined') {
      totalVerifications = await Verification.count({
        where: { institutionId: institution.id },
      });

  
    }

    res.json({
      totalStudents,
      totalVerifications,
      totalSpent,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get institution's students
router.get('/', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const students = await Student.findAll({
      where: { institutionId: institution.id },
      order: [['createdAt', 'DESC']],
    });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;