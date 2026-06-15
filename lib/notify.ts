// ----------------------------------------------------------------------------
// Transactional email over SMTP (Gmail SMTP with an app password works well):
//   - login-alert emails (security notification on every successful login)
//   - login OTP codes (8-digit second factor)
//
// Optional: if the SMTP_* env vars aren't set, the helpers are no-ops / report
// not-configured. Failures are logged but never throw to the caller. Server-only.
// ----------------------------------------------------------------------------

import nodemailer, { type Transporter } from "nodemailer";
import { otpEmail, loginAlertEmail } from "@/lib/email-templates";

export type LoginAlert = {
  email: string;
  ip: string;
  userAgent: string;
  when: string; // ISO timestamp
};

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.LOGIN_ALERT_EMAIL,
  );
}

function buildTransporter(): Transporter {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    // Cap the time spent so a flaky SMTP can never hang the request.
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  });
}

// --- login-alert email (master switch LOGIN_ALERT_ENABLED) -----------------

function alertsEnabled(): boolean {
  const flag = process.env.LOGIN_ALERT_ENABLED?.trim().toLowerCase();
  return flag !== "false" && flag !== "0" && flag !== "no";
}

export async function sendLoginAlert(alert: LoginAlert): Promise<void> {
  if (!alertsEnabled()) return; // explicitly switched off
  if (!isSmtpConfigured()) return; // SMTP not configured — nothing to do

  try {
    const { html, text } = loginAlertEmail(alert);
    await buildTransporter().sendMail({
      from: `"Codinative Dashboard" <${process.env.SMTP_USER}>`,
      to: process.env.LOGIN_ALERT_EMAIL,
      subject: `🔐 Dashboard login — ${alert.email}`,
      text,
      html,
    });
  } catch (err) {
    console.error(
      "login alert email failed:",
      err instanceof Error ? err.message : err,
    );
  }
}

// --- login OTP code email ---------------------------------------------------

// Throws on failure so the caller can tell the user "couldn't send code".
export async function sendOtpCode(
  toEmail: string,
  code: string,
  ttlMinutes: number,
): Promise<void> {
  const { html, text } = otpEmail(code, ttlMinutes);
  await buildTransporter().sendMail({
    from: `"Codinative Dashboard" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Your dashboard login code: ${code}`,
    text,
    html,
  });
}
