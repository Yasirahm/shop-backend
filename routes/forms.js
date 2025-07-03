const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,     // Your Gmail
      pass: process.env.EMAIL_PASS,     // App password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,               // Can be a single email or array
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
