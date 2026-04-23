const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendToOpusTrigger(triggerAddress, subject, text, attachments = []) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: triggerAddress,
    subject,
    text,
    attachments,
  });
}

async function sendToAttendees(recipients, subject, htmlBody, attachments = []) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipients.join(', '),
    subject,
    html: htmlBody,
    attachments,
  });
}

module.exports = { sendToOpusTrigger, sendToAttendees };
