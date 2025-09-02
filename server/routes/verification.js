const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const { Student, Institution, VerificationLog, User } = require("../models");
const generateCertificate = require("../../src/utils/generateCertificate");

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
router.post("/verify", async (req, res) => {
  try {
    const { regNumber, userId } = req.body;

    // Get user
    const user = await User.findByPk(userId);
    if (!user || user.credits < 1) {
      return res.status(403).json({ message: "Not enough credits", success: false });
    }

    // Find student
    const student = await Student.findOne({
      where: { certificateNumber: regNumber },
      include: [{ model: Institution }],
    });

    if (!student) {
      return res.status(404).json({
        message: "Certificate Not Found or Not Verified",
        success: false,
        creditsRemaining: user.credits - 1,
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
    });

    // Generate certificate
    const downloadUrl = generateCertificate(normalizeStudent(student));

    res.json({
      success: true,
      message: "Certificate verified successfully",
      student: {
        regNumber: student.certificateNumber,
        name: student.fullName,
        course: student.department,
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
router.post("/bulk-verify", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
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
        // Deduct credit per student
        if (user.credits < 1) {
          results.push({ regNumber: reg, status: "Failed - Not enough credits" });
          continue;
        }

        user.credits -= 1;
        await user.save();

        // Log verification
        await VerificationLog.create({
          userId: user.id,
          studentId: student.id,
          institutionId: student.institutionId,
        });

        // Generate certificate
        const downloadUrl = generateCertificate(normalizeStudent(student));

        results.push({
          regNumber: reg,
          status: "Verified",
          name: student.fullName,
          course: student.department,
          institution: student.Institution.name,
          downloadUrl,
        });
      } else {
        results.push({ regNumber: reg, status: "Certificate Not Found" });
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
