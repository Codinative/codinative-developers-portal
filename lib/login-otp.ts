// ----------------------------------------------------------------------------
// Email-based one-time login codes (second factor).
//
// Flow: after the password is verified, generate an 8-digit code, store only
// its bcrypt hash in Firestore (appConfig has its own lockdown rule via the
// `loginOtps` collection), email the plaintext, and require it on the second
// step. Codes are single-use, expire fast, and lock after a few wrong tries.
// Server-only (firebase-admin + bcrypt + node crypto).
// ----------------------------------------------------------------------------

import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
import { getDashboardDb } from "@/lib/firebase-admin";
import { isSmtpConfigured, sendOtpCode } from "@/lib/notify";

const COLLECTION = "loginOtps";
const CODE_DIGITS = 8;
const TTL_MS = 2 * 60 * 1000; // 2 minutes
const MAX_ATTEMPTS = 5;

export const OTP_TTL_MINUTES = 2;

// OTP is active only when explicitly enabled AND SMTP can actually deliver it
// (otherwise enabling it would lock the admin out).
export function otpEnabled(): boolean {
  const flag = process.env.LOGIN_OTP_ENABLED?.trim().toLowerCase();
  const off = flag === "false" || flag === "0" || flag === "no";
  return !off && isSmtpConfigured();
}

// Firestore doc ids can't contain "/"; emails are otherwise fine. Normalize.
function docId(email: string): string {
  return email.trim().toLowerCase().replace(/\//g, "_");
}

function generateCode(): string {
  // 0 .. 10^8-1, zero-padded — uniform via CSPRNG.
  return String(randomInt(0, 10 ** CODE_DIGITS)).padStart(CODE_DIGITS, "0");
}

/** Generate a code, store its hash, and email the plaintext. Returns the
 *  expiry timestamp (epoch ms) so the UI can show an accurate countdown. Throws
 *  if the email fails to send (so the caller can surface it instead of trapping
 *  the user on a code screen for a code that never arrives). */
export async function issueLoginCode(email: string): Promise<number> {
  const code = generateCode();
  const hash = await bcrypt.hash(code, 10);
  const expiresAt = Date.now() + TTL_MS;

  await getDashboardDb()
    .collection(COLLECTION)
    .doc(docId(email))
    .set({
      hash,
      expiresAt,
      attempts: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

  // If the email can't be sent, drop the code so a stale one can't linger.
  try {
    await sendOtpCode(email, code, OTP_TTL_MINUTES);
  } catch (err) {
    await getDashboardDb().collection(COLLECTION).doc(docId(email)).delete().catch(() => {});
    throw err instanceof Error ? err : new Error("Failed to send code");
  }

  return expiresAt;
}

/** Verify a submitted code. Single-use on success; counts attempts and locks
 *  after MAX_ATTEMPTS; rejects expired codes. */
export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<boolean> {
  if (!code || !/^\d{6,8}$/.test(code.trim())) return false;

  const ref = getDashboardDb().collection(COLLECTION).doc(docId(email));
  const snap = await ref.get();
  if (!snap.exists) return false;

  const data = snap.data() as {
    hash?: string;
    expiresAt?: number;
    attempts?: number;
  };

  if (
    typeof data.hash !== "string" ||
    typeof data.expiresAt !== "number" ||
    Date.now() > data.expiresAt ||
    (data.attempts ?? 0) >= MAX_ATTEMPTS
  ) {
    // Expired or too many tries — burn it so it can't be reused.
    await ref.delete().catch(() => {});
    return false;
  }

  const ok = await bcrypt.compare(code.trim(), data.hash);
  if (!ok) {
    await ref.update({ attempts: FieldValue.increment(1) }).catch(() => {});
    return false;
  }

  await ref.delete().catch(() => {}); // single-use
  return true;
}
