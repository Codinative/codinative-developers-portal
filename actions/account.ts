"use server";

import bcrypt from "bcryptjs";
import { requireAuth, requireOwner } from "@/lib/auth-helpers";
import {
  getEffectiveAdmin,
  getStoredAdmin,
  setStoredAdmin,
} from "@/lib/admin-config";
import { findUserById, setUserPassword } from "@/lib/users-store";
import { revalidatePath } from "next/cache";

type ActionResult = { success: boolean; error?: string };

/** The current admin email + whether credentials live in the DB or env.
 *  Owner-only: this describes the owner login, not the caller's own login. */
export async function getAccountInfo(): Promise<{
  email: string;
  source: "store" | "env" | "none";
}> {
  await requireOwner();
  const stored = await getStoredAdmin();
  if (stored) return { email: stored.email, source: "store" };
  const env = await getEffectiveAdmin();
  if (env) return { email: env.email, source: "env" };
  return { email: "", source: "none" };
}

/** Change the admin login. Requires the current password to authorize. The new
 *  password (if given) is bcrypt-hashed before storage; plaintext is never kept.
 *  Owner-only. */
export async function updateAdminCredentials(
  newEmail: string,
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    await requireOwner();

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

/** The signed-in team member's own email — for self-service settings. Not
 *  available to the owner (whose login is env/store-backed, see above). */
export async function getMyAccountInfo(): Promise<{ email: string }> {
  const session = await requireAuth();
  return { email: session.user?.email ?? "" };
}

/** Let a team member change their own password. Requires their current
 *  password to authorize — this only ever touches the caller's own login. */
export async function updateMyPassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    const session = await requireAuth();
    const id = session.user?.id;
    if (!id) return { success: false, error: "Not signed in." };

    if (!currentPassword)
      return { success: false, error: "Enter your current password." };
    if (!newPassword || newPassword.length < 8)
      return { success: false, error: "New password must be at least 8 characters." };

    const me = await findUserById(id);
    if (!me) return { success: false, error: "Account not found." };

    const ok = await bcrypt.compare(currentPassword, me.passwordHash);
    if (!ok) return { success: false, error: "Current password is incorrect." };

    const res = await setUserPassword(id, newPassword);
    if (res.success) revalidatePath("/settings");
    return res;
  } catch (err) {
    console.error("updateMyPassword error:", err);
    return { success: false, error: "Failed to update password." };
  }
}
