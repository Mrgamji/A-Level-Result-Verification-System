const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generate a perfectly centered certificate PDF for a student.
 * @param {Object} student
 * @param {string} student.regNumber
 * @param {string} student.name
 * @param {string} student.course
 * @param {string} student.institution
 * @returns {Promise<string>} Relative path for frontend
 */
function generateCertificate(student) {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(__dirname, "../uploads/certificates");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, `${student.regNumber}.pdf`);
      const doc = new PDFDocument({ size: "A4", margins: { top: 50, bottom: 50, left: 50, right: 50 } });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      writeStream.on("finish", () => resolve(`/uploads/certificates/${student.regNumber}.pdf`));
      writeStream.on("error", (err) => reject(err));

      // Colors
      const primary = "#004d00";
      const secondary = "#006400";
      const light = "#e8f5e8";
      const gold = "#d4af37";
      const boxBg = "#f8fff8";

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(light);

      // Outer borders
      doc.strokeColor(secondary).lineWidth(15).rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke();
      doc.strokeColor(gold).lineWidth(2).rect(45, 45, doc.page.width - 90, doc.page.height - 90).stroke();

      // Watermark behind content
      doc.save();
      doc.opacity(0.06).fontSize(80).fillColor(primary).font("Helvetica-Bold")
        .text("OFFICIAL VERIFICATION", 0, doc.page.height / 2 - 40, { width: doc.page.width, align: "center" });
      doc.restore();

      // Emblem circle
      const emblemX = doc.page.width / 2;
      const emblemY = 90;
      doc.save();
      doc.circle(emblemX, emblemY, 32).fill(secondary);
      doc.restore();
      doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold")
        .text("NG", emblemX - 15, emblemY - 12, { width: 30, align: "center", characterSpacing: 2 });

      // Header
      doc.moveDown(0.5);
      doc.fontSize(22).fillColor(primary).font("Helvetica-Bold")
        .text("NIGERIAN A-LEVEL RESULT VERIFICATION SYSTEM", { align: "center", characterSpacing: 1.2 });
      doc.fontSize(12).fillColor(secondary).font("Helvetica-Oblique")
        .text("Federal Ministry of Education, Nigeria", { align: "center" });

      doc.moveDown(1.5);

      // Main title
      doc.fontSize(28).fillColor(primary).font("Helvetica-Bold")
        .text("CERTIFICATE OF VERIFICATION", { align: "center", underline: true, characterSpacing: 1.5 });

      // Decorative separator
      doc.moveDown(0.5);
      const sepY = doc.y;
      doc.strokeColor(gold).lineWidth(1.5).moveTo(80, sepY).lineTo(doc.page.width - 80, sepY).stroke();
      doc.moveDown(1.5);

      // Info Box
      const boxWidth = doc.page.width - 110; // consistent padding from borders
      const boxHeight = 200;
      const boxX = (doc.page.width - boxWidth) / 2;
      const boxY = doc.y;

      // Draw box
      doc.save();
      doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 14).fillAndStroke(boxBg, secondary);
      doc.restore();

      // Box contents (centered)
      const contentWidth = boxWidth - 48; // padding 24 on both sides
      let currentY = boxY + 24;

      doc.fontSize(14).fillColor(primary).font("Helvetica")
        .text("This is to certify that the academic records of:", boxX + 24, currentY, { width: contentWidth, align: "center" });

      currentY += 38;
      doc.fontSize(22).fillColor(secondary).font("Helvetica-Bold")
        .text(student.name.toUpperCase(), boxX + 24, currentY, { width: contentWidth, align: "center", characterSpacing: 1.2 });

      currentY += 44;
      const infoPairs = [
        ["Registration Number", student.regNumber],
        ["Institution", student.institution],
        ["Course of Study", student.course],
      ];

      infoPairs.forEach(([label, value]) => {
        doc.fontSize(13).fillColor(primary).font("Helvetica")
          .text(`${label}: `, boxX + 24, currentY, { width: contentWidth / 2, align: "right", continued: true })
          .font("Helvetica-Bold")
          .text(value, { width: contentWidth / 2, align: "left" });
        currentY += 24;
      });

      // Verification statement
      doc.fontSize(12).fillColor(primary).font("Helvetica-Oblique")
        .text("The above information has been verified through the Nigerian A-Level Result Verification System and is accurate and valid.",
          boxX + 24, currentY, { width: contentWidth, align: "center", lineGap: 4 });
      currentY += 50;

      // Accreditation logos
      const colWidth = boxWidth / 3;
      doc.fontSize(11).fillColor(primary).font("Helvetica-Bold")
        .text("JAMB", boxX, currentY, { width: colWidth, align: "center" })
        .text("NUC", boxX + colWidth, currentY, { width: colWidth, align: "center" })
        .text("NBTE", boxX + 2 * colWidth, currentY, { width: colWidth, align: "center" });

      currentY += 28;
      // Date & verification ID
      const verificationID = `NARVS-${student.regNumber}-${Date.now().toString().slice(-6)}`;
      doc.fontSize(10).fillColor(primary).font("Helvetica")
        .text(`Date of Verification: ${new Date().toLocaleDateString()}`, boxX, currentY, { width: boxWidth, align: "center" })
        .moveDown(0.2)
        .text(`Verification ID: ${verificationID}`, boxX, doc.y, { width: boxWidth, align: "center" });

      currentY = doc.y + 40;

      // Signatures
      const sigWidth = 140;
      const sigY = currentY;

      // Left
      doc.strokeColor(secondary).lineWidth(1.2)
        .moveTo(boxX + 10, sigY).lineTo(boxX + 10 + sigWidth, sigY).stroke();
      doc.fontSize(10).fillColor(primary).font("Helvetica")
        .text("_________________________", boxX + 10, sigY + 4, { width: sigWidth, align: "center" })
        .font("Helvetica-Oblique")
        .text("Director, Verification Services", boxX + 10, sigY + 20, { width: sigWidth, align: "center" });

      // Right
      doc.strokeColor(secondary).lineWidth(1.2)
        .moveTo(boxX + boxWidth - sigWidth - 10, sigY).lineTo(boxX + boxWidth - 10, sigY).stroke();
      doc.fontSize(10).fillColor(primary).font("Helvetica")
        .text("_________________________", boxX + boxWidth - sigWidth - 10, sigY + 4, { width: sigWidth, align: "center" })
        .font("Helvetica-Oblique")
        .text("Registrar, Nigerian Education System", boxX + boxWidth - sigWidth - 10, sigY + 20, { width: sigWidth, align: "center" });

      // Footer
      doc.fontSize(8).fillColor(secondary).font("Helvetica-Oblique")
        .text("Electronically generated. Verify authenticity at https://verify.alevel.ng",
          boxX, doc.page.height - 40, { width: boxWidth, align: "center" });

      doc.end();

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateCertificate;
