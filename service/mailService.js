const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:process.env.MAILER_SERVICE_EMAIL,
        pass:process.env.MAILER_SERVICE_PASSWORD
    }
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.MAILER_SERVICE_EMAIL,
    to,
    subject,
    // text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;

