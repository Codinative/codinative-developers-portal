// ----------------------------------------------------------------------------
// Team login accounts, stored in the dashboard's own Firestore so teammates can
// be added from the Settings UI — no redeploy, unlike env-var credentials.
//
// The single "owner" admin still lives in appConfig/admin (see admin-config.ts)
// with an env bootstrap fallback; these are ADDITIONAL member logins. Passwords
// are bcrypt-hashed at rest and never returned to the browser. Server-only.
// ----------------------------------------------------------------------------

import bcrypt from "bcryptjs";
import { FieldValue } from "firebase-admin/firestore";
import { getDashboardDb } from "@/lib/firebase-admin";
import { getEffectiveAdmin } from "@/lib/admin-config";

const COLLECTION = "dashboardUsers";

export type DashboardUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // server-side only — never send to the browser
  createdAt: string;
  createdBy: string;
};

// Browser-safe view (no password hash).
export type DashboardUserSummary = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  createdBy: string;
};

// The account a successful login resolves to (owner admin or a team member).
export type AuthAccount = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "member";
};

export type StoreResult = { success: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// --- reads -----------------------------------------------------------------

export async function findUserByEmail(email: string): Promise<DashboardUser | null> {
  try {
    const snap = await getDashboardDb()
      .collection(COLLECTION)
      .where("email", "==", normalizeEmail(email))
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const d = doc.data();
    if (typeof d.email !== "string" || typeof d.passwordHash !== "string") return null;
    return {
      id: doc.id,
      email: d.email,
      name: typeof d.name === "string" ? d.name : d.email,
      passwordHash: d.passwordHash,
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? "",
      createdBy: typeof d.createdBy === "string" ? d.createdBy : "admin",
    };
  } catch {
    return null;
  }
}

export async function listUsers(): Promise<DashboardUserSummary[]> {
  let snap;
  try {
    snap = await getDashboardDb().collection(COLLECTION).get();
  } catch {
    return [];
  }
  return snap.docs
    .map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        email: typeof d.email === "string" ? d.email : "",
        name: typeof d.name === "string" ? d.name : "",
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? "",
        createdBy: typeof d.createdBy === "string" ? d.createdBy : "admin",
      };
    })
    .sort((a, b) => a.email.localeCompare(b.email));
}

/** Resolve a login attempt against the owner admin first, then team members.
 *  Returns the matched account, or null if the credentials don't match any. */
export async function resolveLogin(
  email: string,
  password: string,
): Promise<AuthAccount | null> {
  const e = normalizeEmail(email);

  // 1) Owner admin (Firestore appConfig/admin or env fallback).
  const admin = await getEffectiveAdmin();
  if (
    admin &&
    e === admin.email.toLowerCase() &&
    (await bcrypt.compare(password, admin.passwordHash))
  ) {
    return { id: "admin", email: admin.email, name: "Admin", role: "owner" };
  }

  // 2) Team member.
  const user = await findUserByEmail(e);
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    return { id: user.id, email: user.email, name: user.name || user.email, role: "member" };
  }

  return null;
}

// --- writes ----------------------------------------------------------------

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  createdBy: string;
}): Promise<StoreResult> {
  const email = normalizeEmail(input.email);
  const name = input.name?.trim() || email;

  if (!EMAIL_RE.test(email)) return { success: false, error: "Enter a valid email address." };
  if (!input.password || input.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  // Don't shadow the owner admin's email.
  const admin = await getEffectiveAdmin();
  if (admin && email === admin.email.toLowerCase()) {
    return { success: false, error: "That email is already the owner admin login." };
  }

  const db = getDashboardDb();

  const existing = await db
    .collection(COLLECTION)
    .where("email", "==", email)
    .limit(1)
    .get();
  if (!existing.empty) {
    return { success: false, error: `A login for "${email}" already exists.` };
  }

  await db.collection(COLLECTION).add({
    email,
    name,
    passwordHash: await bcrypt.hash(input.password, 12),
    createdAt: FieldValue.serverTimestamp(),
    createdBy: input.createdBy,
  });

  return { success: true };
}

export async function setUserPassword(
  id: string,
  password: string,
): Promise<StoreResult> {
  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }
  await getDashboardDb()
    .collection(COLLECTION)
    .doc(id)
    .update({
      passwordHash: await bcrypt.hash(password, 12),
      updatedAt: FieldValue.serverTimestamp(),
    });
  return { success: true };
}

export async function deleteUser(id: string): Promise<StoreResult> {
  if (!id) return { success: false, error: "Missing user id." };
  await getDashboardDb().collection(COLLECTION).doc(id).delete();
  return { success: true };
}
