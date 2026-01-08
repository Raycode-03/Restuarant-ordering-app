import transporter from "@/lib/transporter"

export async function sendcode(email, code) {
  const mailOptions = {
    from: `"BookHive" <${process.env.EMAIL_ADMIN}>`,
    to: email,
    subject: 'Your Password Reset Code',
    text: `Your password reset code is: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4f46e5;">Hi there,</h2>
        <p>Your password reset code is: <strong>${code}</strong></p>
        <p>Please use this code to reset your password.</p>
        <p>Cheers,<br><strong>The Flowline Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}