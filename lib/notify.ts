// ----------------------------------------------------------------------------
// Login-alert email (security). On every successful login, send a notification
// to LOGIN_ALERT_EMAIL via SMTP (Gmail SMTP with an app password works well).
//
// Entirely optional: if the SMTP_* env vars aren't set, this is a no-op. It is
// also fail-safe — a delivery failure is logged but never blocks or breaks the
// login flow. Server-only.
// ----------------------------------------------------------------------------

import nodemailer from "nodemailer";

export type LoginAlert = {
  email: string;
  ip: string;
  userAgent: string;
  when: string; // ISO timestamp
};

// Master on/off switch. Defaults ON; set LOGIN_ALERT_ENABLED=false to disable
// alerts entirely without removing the SMTP credentials.
function alertsEnabled(): boolean {
  const flag = process.env.LOGIN_ALERT_ENABLED?.trim().toLowerCase();
  return flag !== "false" && flag !== "0" && flag !== "no";
}

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.LOGIN_ALERT_EMAIL,
  );
}

export async function sendLoginAlert(alert: LoginAlert): Promise<void> {
  if (!alertsEnabled()) return; // explicitly switched off
  if (!smtpConfigured()) return; // SMTP not configured — nothing to do

  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Cap the time spent so a flaky SMTP can never hang the login response.
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });

    await transporter.sendMail({
      from: `"Codinative Dashboard" <${process.env.SMTP_USER}>`,
      to: process.env.LOGIN_ALERT_EMAIL,
      subject: `🔐 Dashboard login — ${alert.email}`,
      text: [
        "A successful login to the Codinative Dashboard just occurred.",
        "",
        `Account: ${alert.email}`,
        `Time:    ${alert.when}`,
        `IP:      ${alert.ip}`,
        `Device:  ${alert.userAgent}`,
        "",
        "If this wasn't you, change the password in Settings → Login credentials immediately.",
      ].join("\n"),
    });
  } catch (err) {
    // Never let an email problem affect login.
    console.error(
      "login alert email failed:",
      err instanceof Error ? err.message : err,
    );
  }
}
