const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generate a certificate PDF for a student
 * @param {Object} student - Normalized student object
 * @param {string} student.regNumber
 * @param {string} student.name
 * @param {string} student.course
 * @param {string} student.institution
 * @returns {string} downloadUrl - Path to download the PDF
 */
function generateCertificate(student) {
  const uploadDir = path.join(__dirname, "../uploads/certificates");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `${student.regNumber}.pdf`);

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Certificate layout
  doc.fontSize(22).text("Certificate of Verification", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(14).text(`Institution: ${student.institution}`);
  doc.text(`Name: ${student.name}`);
  doc.text(`Course: ${student.course}`);
  doc.text(`Registration Number: ${student.regNumber}`);
  doc.moveDown(2);

  doc.text("This is to certify that the above student’s records were verified.", {
    align: "left",
  });

  doc.end();

  return `/uploads/certificates/${student.regNumber}.pdf`;
}

module.exports = generateCertificate;
