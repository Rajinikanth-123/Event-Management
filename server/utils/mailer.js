const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;