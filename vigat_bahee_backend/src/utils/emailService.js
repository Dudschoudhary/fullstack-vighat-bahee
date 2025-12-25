import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // 587 + STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email, token) => {
  console.log("teja..",process.env.SMTP_HOST)
  const resetUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;

  console.log('Sending reset email to:', email, 'via', process.env.SMTP_HOST);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Your VigatBahee Password',
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}" style="background:#6366f1;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
        Reset Password
      </a>
      <p>Link expires in 15 minutes.</p>
    `,
  });
};