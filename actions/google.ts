"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  googleConfigured,
  getGoogleConnection,
  listFirebaseProjects,
  disconnectGoogle,
} from "@/lib/google-oauth";
import {
  addGoogleProjectRecord,
  listProjectFirebaseIds,
} from "@/lib/projects-store";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

type ActionResult = { success: boolean; error?: string };

export type DiscoveredProjectView = {
  projectId: string;
  displayName: string;
  added: boolean;
};

export type GoogleStatus = {
  configured: boolean;
  connected: boolean;
  email?: string;
  projects: DiscoveredProjectView[];
  error?: string;
};

export async function getGoogleStatus(): Promise<GoogleStatus> {
  await requireAuth();

  if (!googleConfigured()) {
    return { configured: false, connected: false, projects: [] };
  }

  const connection = await getGoogleConnection();
  if (!connection) {
    return { configured: true, connected: false, projects: [] };
  }

  try {
    const [discovered, addedIds] = await Promise.all([
      listFirebaseProjects(),
      listProjectFirebaseIds(),
    ]);
    const added = new Set(addedIds);
    return {
      configured: true,
      connected: true,
      email: connection.email,
      projects: discovered.map((p) => ({
        ...p,
        added: added.has(p.projectId),
      })),
    };
  } catch (err) {
    console.error("getGoogleStatus error:", err);
    return {
      configured: true,
      connected: true,
      email: connection.email,
      projects: [],
      error:
        "Connected, but couldn't list Firebase projects. Check that the " +
        "Firebase Management API is enabled and the granted scopes are correct.",
    };
  }
}

export async function addDiscoveredProject(
  projectId: string,
  displayName: string,
): Promise<ActionResult> {
  try {
    const session = await requireAuth();
    const result = await addGoogleProjectRecord(
      projectId,
      displayName,
      session.user?.email ?? "admin",
    );
    if (result.success) {
      revalidatePath("/settings");
      revalidatePath("/");
      revalidatePath("/secrets");
    }
    return result;
  } catch (err) {
    console.error("addDiscoveredProject error:", err);
    return { success: false, error: "Failed to add the project." };
  }
}

export async function disconnectGoogleAccount(): Promise<ActionResult> {
  try {
    await requireAuth();
    await disconnectGoogle();
    revalidatePath("/settings");
    return { success: true };
  } catch (err) {
    console.error("disconnectGoogleAccount error:", err);
    return { success: false, error: "Failed to disconnect." };
  }
}
