import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailPort === 465,
      auth: {
        user: env.emailUser,
        pass: env.emailPassword,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  await t.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
  });
}

export async function sendOtpEmail(to, otp) {
  await sendMail({
    to,
    subject: "Verify your email — Farmer Marketplace",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Verify your email</h2>
        <p>Use the code below to verify your account. This code expires in ${env.otpExpiryMinutes} minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 0;">${otp}</div>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to, resetUrl) {
  await sendMail({
    to,
    subject: "Reset your password — Farmer Marketplace",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to reset your password. This link expires in ${env.resetTokenExpiryMinutes} minutes.</p>
        <p><a href="${resetUrl}" style="background:#16a34a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
