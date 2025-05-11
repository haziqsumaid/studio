import nodemailer from 'nodemailer';

const emailUser = process.env.SMTP_USER;
const emailPass = process.env.SMTP_PASS;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const senderEmail = process.env.NODEMAILER_SENDER_EMAIL;

// Basic check for required environment variables
// In a real production app, you might want more robust checks or a config service
if (!emailUser || !emailPass || !smtpHost || !smtpPort || !senderEmail) {
  // During development, allow missing env vars to avoid breaking UI work
  // Log a warning instead of throwing an error if not in production
  if (process.env.NODE_ENV !== 'development') {
    console.error('CRITICAL: Missing one or more SMTP environment variables for Nodemailer. Email functionality will be disabled.');
  } else {
    console.warn('Warning: Missing one or more SMTP environment variables for Nodemailer. Email functionality will simulate sending to console.');
  }
}

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: parseInt(smtpPort || "587"), // Default to 587 if not set
  secure: parseInt(smtpPort || "587") === 465, // true for 465, false for other ports like 587
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  // Adding timeout options for resilience
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (mailOptions: MailOptions) => {
  // If critical SMTP variables are missing, prevent email sending.
  if (!emailUser || !emailPass || !smtpHost || !smtpPort || !senderEmail) {
    if (process.env.NODE_ENV === 'development') {
      console.log("DEV MODE: SMTP environment variables not fully set. Email not sent. Details:", mailOptions);
      // Simulate success in dev mode to allow UI testing
      return { success: true, message: "Email logged to console (SMTP not configured for sending)." };
    }
    // For production, this would be a critical failure.
    console.error("Production Error: Attempted to send email without complete SMTP configuration.");
    throw new Error("Email service is not configured properly. Please contact support.");
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.NODEMAILER_SENDER_NAME || 'Portfolio Contact'}" <${senderEmail}>`, // Sender address
      ...mailOptions,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, message: "Email sent successfully.", messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    // It's often better to throw a generic error to the client and log the specific one.
    throw new Error(`Failed to send email. Please try again later.`);
  }
};

// Add a note for the developer regarding .env.local setup
/*
IMPORTANT FOR DEVELOPER:
To enable email sending, create or update your .env.local file with the following:

SMTP_HOST=your_smtp_host_address
SMTP_PORT=your_smtp_port (e.g., 587 for TLS, 465 for SSL)
SMTP_USER=your_smtp_username (often your email address)
SMTP_PASS=your_smtp_password_or_app_password
NODEMAILER_SENDER_EMAIL=your_verified_sender_email_address
NODEMAILER_SENDER_NAME="Your Name or Website Name" (Optional, for the 'from' field)

Ensure these are correctly configured for your email provider (e.g., Gmail, SendGrid, Mailgun).
For Gmail, you might need to enable "Less secure app access" or generate an "App Password".
*/
