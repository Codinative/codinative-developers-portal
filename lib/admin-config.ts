// ----------------------------------------------------------------------------
// Admin login credentials, stored in the dashboard's own Firestore so they can
// be changed from the Settings UI. The env vars ADMIN_EMAIL / ADMIN_PASSWORD_HASH
// remain the bootstrap fallback used on first run, before anything is stored.
// Server-only (imports firebase-admin).
// ----------------------------------------------------------------------------

import { FieldValue } from "firebase-admin/firestore";
import { getDashboardDb } from "@/lib/firebase-admin";

const DOC = { collection: "appConfig", id: "admin" } as const;

export type AdminCredentials = { email: string; passwordHash: string };

/** Stored admin doc, or null if none has been set (use env fallback then). */
export async function getStoredAdmin(): Promise<AdminCredentials | null> {
  try {
    const doc = await getDashboardDb()
      .collection(DOC.collection)
      .doc(DOC.id)
      .get();
    if (!doc.exists) return null;
    const d = doc.data();
    if (
      d &&
      typeof d.email === "string" &&
      typeof d.passwordHash === "string"
    ) {
      return { email: d.email, passwordHash: d.passwordHash };
    }
    return null;
  } catch {
    return null;
  }
}

/** The effective admin: stored doc if present, otherwise env vars. */
export async function getEffectiveAdmin(): Promise<AdminCredentials | null> {
  const stored = await getStoredAdmin();
  if (stored) return stored;
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (email && passwordHash) return { email, passwordHash };
  return null;
}

export async function setStoredAdmin(
  email: string,
  passwordHash: string,
): Promise<void> {
  await getDashboardDb()
    .collection(DOC.collection)
    .doc(DOC.id)
    .set(
      { email, passwordHash, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
}
