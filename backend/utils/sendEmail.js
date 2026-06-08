const nodemailer = require('nodemailer');

/**
 * Sends an email notification using SMTP configuration
 * @param {Object} options - Email options (subject, text, html)
 */
const sendEmail = async (options) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailTo = process.env.SMTP_TO || 'sa10sandeep21@gmail.com';

  // If credentials are not set, we log a warning and return gracefully
  if (!smtpUser || !smtpPass) {
    console.warn('SMTP_USER and/or SMTP_PASS are not configured in your backend .env file.');
    console.warn(`Simulated Email would have been sent to: ${emailTo}`);
    console.warn(`Subject: ${options.subject}`);
    console.warn(`Message: ${options.text}`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `"Portfolio Notification" <${smtpUser}>`,
    to: emailTo,
    replyTo: options.replyTo || smtpUser,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email notification successfully sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};

module.exports = sendEmail;
