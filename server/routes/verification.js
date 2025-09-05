const express = require("express");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

const { Student, Institution, VerificationLog } = require("../models");
const generateCertificate = require("../../src/utils/generateCertificate");
const { authenticateToken, requireRole } = require("../middleware/auth");

// Configure multer for CSV uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Rate limiting for verification endpoint
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const router = express.Router();

// ✅ Normalize student fields for PDF
function normalizeStudent(student) {
  return {
    regNumber: student.certificateNumber,
    name: student.fullName,
    course: student.department || "N/A",
    institution: student.Institution ? student.Institution.name : "Unknown Institution",
  };
}

// ===================
// Single Verification
// ===================
router.post("/verify", authenticateToken, async (req, res) => {
  try {
    const { certificateNumber } = req.body;
    const user = req.user; // ✅ from JWT middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (user.credits < 1) {
      return res.status(403).json({
        message: "Not enough credits",
        success: false,
        creditsRemaining: user.credits,
      });
    }

    // Find student
    const student = await Student.findOne({
      where: { certificateNumber: certificateNumber },
      include: [{ model: Institution }],
    });

    if (!student) {
      return res.status(404).json({
        message: "Certificate Not Found or Not Verified",
        success: false,
        creditsRemaining: user.credits,
      });
    }

    // Deduct credit
    user.credits -= 1;
    await user.save();

    // Log verification
    await VerificationLog.create({
      userId: user.id,
      studentId: student.id,
      institutionId: student.institutionId,
      certificateNumber: certificateNumber,
      ipAddress: req.ip,
      status: student ? "success" : "failed",
  
    });

    // Generate certificate
 // Generate certificate
    const downloadUrl = await generateCertificate(normalizeStudent(student));
    

    res.json({
      success: true,
      message: "Certificate verified successfully",
      data: {
        fullName: student.fullName,
        certificateNumber: student.certificateNumber,
        department: student.department,
        classOfDegree: student.classOfDegree,
        certificateType: student.certificateType,
        yearOfEntry: student.yearOfEntry,
        yearOfGraduation: student.yearOfGraduation,
        institution: student.Institution.name,
      },
      downloadUrl,
      creditsRemaining: user.credits,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

// Bulk verification endpoint
router.post('/bulk-verify', verificationLimiter, authenticateToken, requireRole('institution'), upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const results = [];
    const errors = [];

    // Parse CSV file
    const csvData = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          // Validate required fields
          const requiredFields = ['certificateNumber', 'certificateType', 'yearOfGraduation'];
          const missingFields = requiredFields.filter(field => !data[field]);
          
          if (missingFields.length > 0) {
            errors.push(`Row missing fields: ${missingFields.join(', ')}`);
            return;
          }

          csvData.push({
            certificateNumber: data.certificateNumber.trim(),
            certificateType: data.certificateType.trim(),
            yearOfGraduation: parseInt(data.yearOfGraduation)
          });
        })
        .on('end', async () => {
          try {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            if (errors.length > 0) {
              return res.status(400).json({ errors });
            }

            if (csvData.length === 0) {
              return res.status(400).json({ error: 'No valid data found in CSV' });
            }

            if (csvData.length > 1000) {
              return res.status(400).json({ error: 'Maximum 1000 certificates allowed per upload' });
            }

            // Check credits
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

            if (totalCredits < csvData.length) {
              return res.status(402).json({
                error: 'Insufficient credits',
                message: `You need ${csvData.length} credits but only have ${totalCredits}`,
                required: csvData.length,
                available: totalCredits
              });
            }

            // Process each certificate
            for (const item of csvData) {
              try {
                const student = await Student.findOne({
                  where: {
                    certificateNumber: item.certificateNumber,
                    certificateType: item.certificateType,
                    yearOfGraduation: item.yearOfGraduation
                  },
                  include: [{ model: Institution }]
                });

                // Log verification attempt
                await VerificationLog.create({
                  institutionId: institution.id,
                  amount: 200,
                  certificateNumber: item.certificateNumber,
                  ipAddress,
                  success: !!student,
                });

                results.push({
                  certificateNumber: item.certificateNumber,
                  certificateType: item.certificateType,
                  yearOfGraduation: item.yearOfGraduation,
                  verified: !!student,
                  studentName: student ? student.fullName : null,
                  institution: student ? student.Institution.name : null,
                  department: student ? student.department : null,
                  classOfDegree: student ? student.classOfDegree : null,
                  yearOfEntry: student ? student.yearOfEntry : null,
                  error: student ? null : 'Certificate not found'
                });

              } catch (error) {
                console.error('Error verifying certificate:', error);
                results.push({
                  certificateNumber: item.certificateNumber,
                  certificateType: item.certificateType,
                  yearOfGraduation: item.yearOfGraduation,
                  verified: false,
                  error: 'Verification error'
                });
              }
            }

            // Deduct credits
            await Credit.create({
              institutionId: institution.id,
              amount: totalCredits - csvData.length,
              transactionType: 'usage',
              transactionAmount: csvData.length,
              description: `Bulk verification: ${csvData.length} certificates`,
              reference: `BULK-${Date.now()}`,
            });

            const summary = {
              total: results.length,
              verified: results.filter(r => r.verified).length,
              failed: results.filter(r => !r.verified).length,
              creditsUsed: csvData.length,
              creditsRemaining: totalCredits - csvData.length
            };

            res.json({
              success: true,
              message: `Bulk verification completed. ${summary.verified} of ${summary.total} certificates verified.`,
              results,
              summary
            });

          } catch (error) {
            console.error('Bulk verification error:', error);
            res.status(500).json({ error: 'Bulk verification failed' });
          }
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error);
          res.status(400).json({ error: 'Invalid CSV file format' });
        });
    });

  } catch (error) {
    console.error('Bulk verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download verification report as PDF
router.post('/download-report', authenticateToken, requireRole('institution'), async (req, res) => {
  try {
    const { results } = req.body;
    
    if (!results || results.length === 0) {
      return res.status(400).json({ error: 'No results to generate report' });
    }

    const institution = await Institution.findOne({ where: { userId: req.user.id } });
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=verification-report-${Date.now()}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('A-Level Certificate Verification Report', { align: 'center' });
    doc.moveDown();
    
    // Institution info
    doc.fontSize(12)
       .text(`Institution: ${institution.name}`)
       .text(`Generated: ${new Date().toLocaleString()}`)
       .text(`Total Certificates: ${results.length}`)
       .text(`Verified: ${results.filter(r => r.verified).length}`)
       .text(`Failed: ${results.filter(r => !r.verified).length}`);
    
    doc.moveDown();
    
    // Table header
    const startY = doc.y;
    doc.fontSize(10)
       .text('Certificate Number', 50, startY, { width: 120 })
       .text('Type', 170, startY, { width: 80 })
       .text('Year', 250, startY, { width: 50 })
       .text('Status', 300, startY, { width: 60 })
       .text('Student Name', 360, startY, { width: 150 });
    
    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown(0.5);

    // Table rows
    results.forEach((result, index) => {
      if (doc.y > 700) { // New page if needed
        doc.addPage();
        doc.y = 50;
      }
      
      const y = doc.y;
      doc.fontSize(9)
         .text(result.certificateNumber || '', 50, y, { width: 120 })
         .text(result.certificateType || '', 170, y, { width: 80 })
         .text(result.yearOfGraduation?.toString() || '', 250, y, { width: 50 })
         .text(result.verified ? 'Verified' : 'Failed', 300, y, { width: 60 })
         .text(result.studentName || 'N/A', 360, y, { width: 150 });
      
      doc.moveDown(0.3);
    });

    // Footer
    doc.fontSize(8)
       .text('Generated by A-Level Certificate Verification System', 50, doc.page.height - 50, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

module.exports = router;