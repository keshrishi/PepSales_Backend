const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send Email
async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };
  await transporter.sendMail(mailOptions);
}

// Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS
async function sendSMS(to, body) {
  await twilioClient.messages.create({
    body,
    from: process.env.TWILIO_PHONE,
    to
  });
}

module.exports = { sendEmail, sendSMS };
