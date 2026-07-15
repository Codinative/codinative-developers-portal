"use server";

import { requireOwner } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import {
  listUsers,
  createUser,
  setUserPassword,
  deleteUser,
  updateUserRole,
  type DashboardUserSummary,
  type TeamRole,
} from "@/lib/users-store";

type ActionResult = { success: boolean; error?: string };

// Team management (add/reset/remove other people's logins, and assigning
// roles) is owner-only — a regular team member must not be able to touch
// other members' logins or grant themselves/anyone else owner access.

export async function getTeamUsers(): Promise<DashboardUserSummary[]> {
  await requireOwner();
  return listUsers();
}

export async function createTeamUser(
  email: string,
  name: string,
  password: string,
  role: TeamRole = "member", // least privilege by default
): Promise<ActionResult> {
  try {
    const session = await requireOwner();
    const res = await createUser({
      email,
      name,
      password,
      role,
      createdBy: session.user?.email ?? "admin",
    });
    if (res.success) revalidatePath("/settings/team");
    return res;
  } catch (err) {
    console.error("createTeamUser error:", err);
    return { success: false, error: "Failed to create login." };
  }
}

export async function updateTeamUserRole(
  id: string,
  role: TeamRole,
): Promise<ActionResult> {
  try {
    await requireOwner();
    const res = await updateUserRole(id, role);
    if (res.success) revalidatePath("/settings/team");
    return res;
  } catch (err) {
    console.error("updateTeamUserRole error:", err);
    return { success: false, error: "Failed to update role." };
  }
}

export async function resetTeamUserPassword(
  id: string,
  password: string,
): Promise<ActionResult> {
  try {
    await requireOwner();
    const res = await setUserPassword(id, password);
    if (res.success) revalidatePath("/settings/team");
    return res;
  } catch (err) {
    console.error("resetTeamUserPassword error:", err);
    return { success: false, error: "Failed to reset password." };
  }
}

export async function deleteTeamUser(id: string): Promise<ActionResult> {
  try {
    await requireOwner();
    const res = await deleteUser(id);
    if (res.success) revalidatePath("/settings/team");
    return res;
  } catch (err) {
    console.error("deleteTeamUser error:", err);
    return { success: false, error: "Failed to delete login." };
  }
}
