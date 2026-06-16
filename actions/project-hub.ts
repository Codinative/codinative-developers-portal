"use server";

import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { getDashboardDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------------
// Manual "Projects" hub. A project is a place to collect everything about an
// app/work item: related links and secrets. Projects are created and curated by
// hand.
//
// Secrets are NOT stored here: the project detail page reuses the existing
// secrets vault (actions/secrets.ts), keyed by the project's id as the appId.
// ----------------------------------------------------------------------------

const COLLECTION = "projects";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export type ProjectLink = { id: string; label: string; url: string };

export type HubProject = {
  id: string;
  name: string;
  slug: string;
  description: string;
  links: ProjectLink[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type HubProjectSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  linkCount: number;
  updatedAt: string;
};

type ActionResult = { success: boolean; error?: string };
type CreateResult = ActionResult & { id?: string };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Add a scheme so bare hosts (codinative.com) become valid links. mailto: kept.
function normalizeUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t) || t.startsWith("mailto:")) return t;
  return `https://${t}`;
}

function coerceLink(value: unknown): ProjectLink {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    id: typeof v.id === "string" && v.id ? v.id : randomUUID(),
    label: typeof v.label === "string" ? v.label : "",
    url: typeof v.url === "string" ? v.url : "",
  };
}

function readLinks(data: FirebaseFirestore.DocumentData): ProjectLink[] {
  return Array.isArray(data.links) ? data.links.map(coerceLink) : [];
}

// --- reads -----------------------------------------------------------------

export async function listProjects(): Promise<HubProjectSummary[]> {
  await requireAuth();

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
        name: typeof d.name === "string" ? d.name : "Untitled",
        slug: typeof d.slug === "string" ? d.slug : doc.id,
        description: typeof d.description === "string" ? d.description : "",
        linkCount: Array.isArray(d.links) ? d.links.length : 0,
        updatedAt:
          d.updatedAt?.toDate?.()?.toISOString() ??
          d.createdAt?.toDate?.()?.toISOString() ??
          "",
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<HubProject | null> {
  await requireAuth();

  const doc = await getDashboardDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  const d = doc.data()!;
  return {
    id: doc.id,
    name: typeof d.name === "string" ? d.name : "Untitled",
    slug: typeof d.slug === "string" ? d.slug : doc.id,
    description: typeof d.description === "string" ? d.description : "",
    links: readLinks(d),
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? "",
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? "",
    createdBy: typeof d.createdBy === "string" ? d.createdBy : "admin",
  };
}

// --- writes ----------------------------------------------------------------

export async function createProject(
  name: string,
  description: string,
): Promise<CreateResult> {
  try {
    const session = await requireAuth();
    const n = name?.trim();
    if (!n) return { success: false, error: "A project name is required." };

    const ref = await getDashboardDb().collection(COLLECTION).add({
      name: n,
      slug: slugify(n),
      description: description?.trim() ?? "",
      links: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: session.user?.email ?? "admin",
    });

    revalidatePath("/projects");
    return { success: true, id: ref.id };
  } catch (err) {
    console.error("createProject error:", err);
    return { success: false, error: "Failed to create project." };
  }
}

export async function updateProject(
  id: string,
  name: string,
  description: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const n = name?.trim();
    if (!n) return { success: false, error: "A project name is required." };

    await getDashboardDb().collection(COLLECTION).doc(id).update({
      name: n,
      slug: slugify(n),
      description: description?.trim() ?? "",
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch (err) {
    console.error("updateProject error:", err);
    return { success: false, error: "Failed to update project." };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    await getDashboardDb().collection(COLLECTION).doc(id).delete();
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    console.error("deleteProject error:", err);
    return { success: false, error: "Failed to delete project." };
  }
}

// Shared read-modify-write for the inline `links` array.
async function mutateLinks(
  projectId: string,
  fn: (links: ProjectLink[]) => ProjectLink[] | null,
): Promise<ActionResult> {
  const ref = getDashboardDb().collection(COLLECTION).doc(projectId);
  const doc = await ref.get();
  if (!doc.exists) return { success: false, error: "Project not found" };

  const next = fn(readLinks(doc.data()!));
  if (next === null) return { success: false, error: "Link not found" };

  await ref.update({ links: next, updatedAt: FieldValue.serverTimestamp() });
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  return { success: true };
}

export async function addLink(
  projectId: string,
  label: string,
  url: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const l = label.trim();
    const u = normalizeUrl(url);
    if (!l) return { success: false, error: "A label is required." };
    if (!u) return { success: false, error: "A URL is required." };

    return await mutateLinks(projectId, (links) => {
      links.push({ id: randomUUID(), label: l, url: u });
      return links;
    });
  } catch (err) {
    console.error("addLink error:", err);
    return { success: false, error: "Failed to add link." };
  }
}

export async function deleteLink(
  projectId: string,
  linkId: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    return await mutateLinks(projectId, (links) => {
      const next = links.filter((x) => x.id !== linkId);
      return next.length === links.length ? null : next;
    });
  } catch (err) {
    console.error("deleteLink error:", err);
    return { success: false, error: "Failed to delete link." };
  }
}
