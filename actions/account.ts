"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import {
  getEffectiveAdmin,
  getStoredAdmin,
  setStoredAdmin,
} from "@/lib/admin-config";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

type ActionResult = { success: boolean; error?: string };

/** The current admin email + whether credentials live in the DB or env. */
export async function getAccountInfo(): Promise<{
  email: string;
  source: "store" | "env" | "none";
}> {
  await requireAuth();
  const stored = await getStoredAdmin();
  if (stored) return { email: stored.email, source: "store" };
  const env = await getEffectiveAdmin();
  if (env) return { email: env.email, source: "env" };
  return { email: "", source: "none" };
}

/** Change the admin login. Requires the current password to authorize. The new
 *  password (if given) is bcrypt-hashed before storage; plaintext is never kept. */
export async function updateAdminCredentials(
  newEmail: string,
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    await requireAuth();

    const email = newEmail?.trim();
    if (!email) return { success: false, error: "Email is required." };
    if (!currentPassword)
      return { success: false, error: "Enter your current password." };

    const admin = await getEffectiveAdmin();
    if (!admin)
      return {
        success: false,
        error: "No admin is configured — set ADMIN_EMAIL / ADMIN_PASSWORD_HASH first.",
      };

    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok) return { success: false, error: "Current password is incorrect." };

    if (newPassword && newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters.",
      };
    }

    // Keep the existing hash if no new password was provided (email-only change).
    const passwordHash = newPassword
      ? await bcrypt.hash(newPassword, 12)
      : admin.passwordHash;

    await setStoredAdmin(email, passwordHash);
    revalidatePath("/settings");
    return { success: true };
  } catch (err) {
    console.error("updateAdminCredentials error:", err);
    return { success: false, error: "Failed to update credentials." };
  }
}
