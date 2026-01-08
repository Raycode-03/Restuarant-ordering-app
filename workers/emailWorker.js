import { Worker } from "bullmq";
import Redis from "ioredis";
import nodemailer from "nodemailer";

// Connect to Redis
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not set");
}

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  tls: {},
});

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});

// Create worker
const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`📧 Processing job ${job.id}...`);
    
    const { email, name } = job.data;
    
    await transporter.sendMail({
      from: `"QuickBite 🍽️" <${process.env.EMAIL_ADMIN}>`,
      to: email,
      subject: 'Welcome to QuickBite 🍽️',
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">
            <h2 style="color:#111827;">Hi ${name || "there"}, 👋</h2>
            <p style="color:#374151;">
              Thank you for signing up with <strong>QuickBite</strong> 🍔🍕.
            </p>
            <hr style="margin:20px 0;" />
            <p style="color:#6b7280; font-size:14px;">— The QuickBite Team</p>
          </div>
        </div>
      `
    });
    
    console.log(`✅ Email sent to ${email}`);
  },
  { connection, concurrency: 5 }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

console.log("🚀 Email worker started and listening for jobs...");