"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  listProjectSummaries,
  addProjectRecord,
  deleteProjectRecord,
  getEffectiveApps,
  type ProjectSummary,
  type ConnectInput,
  type ActionResult,
  type AccentColor,
} from "@/lib/projects-store";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

// Browser-safe app metadata (no creds) for pages that list apps.
export type AppListItem = {
  id: string;
  name: string;
  description: string;
  color: AccentColor;
  source: "env" | "store" | "google";
};

export async function getAppList(): Promise<AppListItem[]> {
  await requireAuth();
  const apps = await getEffectiveApps();
  return apps.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    color: a.color,
    source: a.source,
  }));
}

export async function getConnectedProjects(): Promise<ProjectSummary[]> {
  await requireAuth();
  return listProjectSummaries();
}

export async function connectFirebaseProject(
  input: ConnectInput,
): Promise<ActionResult> {
  try {
    const session = await requireAuth();
    const result = await addProjectRecord(
      input,
      session.user?.email ?? "admin",
    );
    if (result.success) {
      revalidatePath("/settings");
      revalidatePath("/");
      revalidatePath("/secrets");
    }
    return result;
  } catch (err) {
    console.error("connectFirebaseProject error:", err);
    return { success: false, error: "Failed to connect the project." };
  }
}

export async function removeFirebaseProject(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    const result = await deleteProjectRecord(id);
    if (result.success) {
      revalidatePath("/settings");
      revalidatePath("/");
      revalidatePath("/secrets");
    }
    return result;
  } catch (err) {
    console.error("removeFirebaseProject error:", err);
    return { success: false, error: "Failed to remove the project." };
  }
}
