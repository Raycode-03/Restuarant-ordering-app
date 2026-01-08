import { Worker } from "bullmq";
import { emailQueue } from "@/lib/queues/emailQueue";
import transporter from "@/lib/transporter"

new Worker(
  "emailQueue",
  async (job) => {
    const { email, name } = job.data;
  const mailOptions = {
    from: `"QuickBite 🍽️" <${process.env.EMAIL_ADMIN}>`,
    to: email,
    subject: 'Welcome to QuickBite 🍽️',
    text: `Hi ${name || 'there'}, welcome to QuickBite!`,
    html: `
  <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">
      
      <h2 style="color:#111827;">Hi ${name || "there"}, 👋</h2>

      <p style="color:#374151;">
        Thank you for signing up with <strong>QuickBite</strong> 🍔🍕.
        
      </p>

      <hr style="margin:20px 0;" />
      
      <p style="color:#6b7280; font-size:14px;">
        — The FoodieHub Team
      </p>
    </div>
  </div>
`

  };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent');
},
   {
    connection: emailQueue.opts.connection,
  }
);