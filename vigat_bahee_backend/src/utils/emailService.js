import nodemailer from 'nodemailer';

export const verifyEmailConfig = async () => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration failed:', error);
    return false;
  }
};

export const sendTempPasswordEmail = async (email, fullname, tempPassword) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'आपका Temporary Password - Vigat Bahee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">नमस्कार ${fullname},</h2>
          <p>आपका temporary password नीचे दिया गया है:</p>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; text-align: center; font-size: 24px; letter-spacing: 2px;">
              ${tempPassword}
            </h3>
          </div>
          <p><strong>महत्वपूर्ण:</strong></p>
          <ul>
            <li>यह temporary password है</li>
            <li>Login करने के बाद तुरंत अपना password बदल दें</li>
            <li>सुरक्षा के लिए यह email को किसी के साथ share न करें</li>
          </ul>
          <p>धन्यवाद,<br>Vigat Bahee Team</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};