const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "bukverify@gmail.com", // your Gmail address
    pass: "mahn cwiy apot tuaj", // your 16-char App Password
  },
});

// Send email function
const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"A Level Result Verification"`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendMail;
