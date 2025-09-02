const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const { Student, Institution, VerificationLog } = require("../models");
const generateCertificate = require("../../src/utils/generateCertificate");
const { authenticateToken } = require("../middleware/auth");

// --- File Upload Setup for Bulk Verify ---
const upload = multer({ dest: "uploads/" });

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

// ===================
// Bulk Verification
// ===================
router.post("/bulk-verify", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const user = req.user; // ✅ from JWT middleware

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded", success: false });
    }

    const filePath = req.file.path;
    const regNumbers = [];

    // Read CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          if (row.regNumber) regNumbers.push(row.regNumber.trim());
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // If no regNumbers found
    if (regNumbers.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "No registration numbers found in file", success: false });
    }

    // Check credits
    if (user.credits < regNumbers.length) {
      fs.unlinkSync(filePath);
      return res.status(403).json({
        message: `Not enough credits. You have ${user.credits} but tried to verify ${regNumbers.length} certificates.`,
        success: false,
        creditsRemaining: user.credits,
      });
    }

    // Find students
    const students = await Student.findAll({
      where: { certificateNumber: regNumbers },
      include: [{ model: Institution }],
    });

    const studentMap = {};
    students.forEach((student) => {
      studentMap[student.certificateNumber] = student;
    });

    const results = [];
    for (let reg of regNumbers) {
      const student = studentMap[reg];

      if (student) {
        // Deduct credit
        if (user.credits < 1) {
          results.push({
            regNumber: reg,
            success: false,
            message: "Not enough credits",
            data: null,
          });
          continue;
        }

        user.credits -= 1;
        await user.save();

        // Log verification
        await VerificationLog.create({
          userId: user.id,
          studentId: student.id,
          institutionId: student.institutionId,
          certificateNumber: student.certificateNumber,   // ✅ use regNumber or actual cert no
          ipAddress: req.ip || req.connection.remoteAddress, // ✅ capture requester IP
        });

        // Generate certificate
        const downloadUrl = await generateCertificate(normalizeStudent(student));

        results.push({
          regNumber: reg,
          success: true,
          message: "Verified",
          data: {
            fullName: student.fullName,
            institution: student.Institution.name,
            downloadUrl,
          },
        });
      } else {
        results.push({
          regNumber: reg,
          success: false,
          message: "Certificate Not Found",
          data: null,
        });
      }
    }

    // Delete uploaded CSV
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      results,
      creditsRemaining: user.credits,
    });
  } catch (error) {
    console.error("Bulk Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

module.exports = router;
