"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  listUsers,
  createUser,
  setUserPassword,
  deleteUser,
  type DashboardUserSummary,
} from "@/lib/users-store";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

type ActionResult = { success: boolean; error?: string };

export async function getTeamUsers(): Promise<DashboardUserSummary[]> {
  await requireAuth();
  return listUsers();
}

export async function createTeamUser(
  email: string,
  name: string,
  password: string,
): Promise<ActionResult> {
  try {
    const session = await requireAuth();
    const res = await createUser({
      email,
      name,
      password,
      createdBy: session.user?.email ?? "admin",
    });
    if (res.success) revalidatePath("/settings");
    return res;
  } catch (err) {
    console.error("createTeamUser error:", err);
    return { success: false, error: "Failed to create login." };
  }
}

export async function resetTeamUserPassword(
  id: string,
  password: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const res = await setUserPassword(id, password);
    if (res.success) revalidatePath("/settings");
    return res;
  } catch (err) {
    console.error("resetTeamUserPassword error:", err);
    return { success: false, error: "Failed to reset password." };
  }
}

export async function deleteTeamUser(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const res = await deleteUser(id);
    if (res.success) revalidatePath("/settings");
    return res;
  } catch (err) {
    console.error("deleteTeamUser error:", err);
    return { success: false, error: "Failed to delete login." };
  }
}
