import { auth } from "@/lib/auth";

// Shared server-action auth guards. Server-only (imports lib/auth.ts).

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/** Same as requireAuth, but also requires the "owner" role — used to gate
 *  team management and owner-credential actions from regular team members. */
export async function requireOwner() {
  const session = await requireAuth();
  if (session.user.role !== "owner") {
    throw new Error("Forbidden — owner access required.");
  }
  return session;
}
