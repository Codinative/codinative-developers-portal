// ----------------------------------------------------------------------------
// HTML email templates. Email clients ignore <style>/external CSS and modern
// layout, so everything is inline-styled and table-based for compatibility
// (Gmail/Outlook/Apple Mail). Each builder returns { html, text } — the text
// version is the plain-text fallback.
// ----------------------------------------------------------------------------

const BRAND = "Codinative Dashboard";
const COLORS = {
  ink: "#111827",
  body: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f3f4f6",
  card: "#ffffff",
  warnBg: "#fffbeb",
  warnInk: "#92400e",
  warnBorder: "#fde68a",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Outer shell: centered card with a dark header bar and a footer line.
function shell(heading: string, inner: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="background:${COLORS.ink};padding:16px 24px;color:#ffffff;font-size:15px;font-weight:600;">
                🛡️&nbsp; ${BRAND}
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 12px;font-size:18px;color:${COLORS.ink};">${heading}</h1>
                ${inner}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-top:1px solid ${COLORS.border};color:${COLORS.muted};font-size:12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                This is an automated message from the ${BRAND}. Please don't reply.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function otpEmail(
  code: string,
  ttlMinutes: number,
): { html: string; text: string } {
  const inner = `
    <p style="margin:0 0 16px;font-size:14px;color:${COLORS.body};line-height:1.5;">
      Use this verification code to finish signing in:
    </p>
    <div style="margin:0 0 16px;padding:18px;text-align:center;background:${COLORS.bg};border:1px solid ${COLORS.border};border-radius:8px;font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:30px;font-weight:700;letter-spacing:8px;color:${COLORS.ink};">${escapeHtml(code)}</div>
    <p style="margin:0 0 4px;font-size:13px;color:${COLORS.muted};line-height:1.5;">
      Expires in ${ttlMinutes} minute${ttlMinutes === 1 ? "" : "s"} · can be used once.
    </p>
    <p style="margin:12px 0 0;font-size:13px;color:${COLORS.muted};line-height:1.5;">
      If you didn't try to sign in, someone may have your password — change it right away.
    </p>`;

  const text = [
    `Your ${BRAND} verification code is:`,
    "",
    `    ${code}`,
    "",
    `It expires in ${ttlMinutes} minute${ttlMinutes === 1 ? "" : "s"} and can be used once.`,
    "If you didn't try to sign in, someone may have your password — change it.",
  ].join("\n");

  return { html: shell("Your login code", inner), text };
}

export function loginAlertEmail(a: {
  email: string;
  when: string;
  ip: string;
  userAgent: string;
}): { html: string; text: string } {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:${COLORS.muted};width:90px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:13px;color:${COLORS.ink};word-break:break-word;">${escapeHtml(value)}</td>
    </tr>`;

  const inner = `
    <p style="margin:0 0 16px;font-size:14px;color:${COLORS.body};line-height:1.5;">
      A successful login to the dashboard just occurred.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      ${row("Account", a.email)}
      ${row("Time", a.when)}
      ${row("IP", a.ip)}
      ${row("Device", a.userAgent)}
    </table>
    <div style="padding:12px 14px;background:${COLORS.warnBg};border:1px solid ${COLORS.warnBorder};border-radius:8px;font-size:13px;color:${COLORS.warnInk};line-height:1.5;">
      If this wasn't you, change the password in <strong>Settings → Login credentials</strong> immediately.
    </div>`;

  const text = [
    `A successful login to the ${BRAND} just occurred.`,
    "",
    `Account: ${a.email}`,
    `Time:    ${a.when}`,
    `IP:      ${a.ip}`,
    `Device:  ${a.userAgent}`,
    "",
    "If this wasn't you, change the password in Settings → Login credentials immediately.",
  ].join("\n");

  return { html: shell("New login", inner), text };
}
