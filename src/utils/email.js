import nodemailer from 'nodemailer';
import { smtpPass, smtpUser } from '../libs/secret.js';

const sendEmail = async (options) => {
  // 01) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  // 02) Define the email options
  const mailOptions = {
    from: `Abu Raihan <aburaihan8715@gmail.com>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // Subject message
    // html:
  };

  // 03) Actually send the email
  await transporter.sendMail(mailOptions);
};

export { sendEmail };
