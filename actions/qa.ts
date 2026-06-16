"use server";

import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { getDashboardDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { getTemplate } from "@/lib/qa-templates";
import {
  type QaStatus,
  type StatusCounts,
  emptyCounts,
  normalizeStatus,
} from "@/lib/qa-status";

const COLLECTION = "qaChecklists";

// Auth guard — call this at the top of every action.
async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export type QaItem = {
  id: string;
  section: string;
  criterion: string;
  status: QaStatus;
  reference: string;
};

export type QaChecklist = {
  id: string;
  name: string;
  appName: string;
  templateId: string;
  templateName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  items: QaItem[];
};

export type QaChecklistSummary = {
  id: string;
  name: string;
  appName: string;
  templateName: string;
  total: number;
  counts: StatusCounts;
  updatedAt: string;
};

type ActionResult = { success: boolean; error?: string };
type CreateResult = ActionResult & { id?: string };

// Defensively coerce a stored item (data came from Firestore).
function coerceItem(value: unknown): QaItem {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    id: typeof v.id === "string" && v.id ? v.id : randomUUID(),
    section: typeof v.section === "string" && v.section ? v.section : "General",
    criterion: typeof v.criterion === "string" ? v.criterion : "",
    status: normalizeStatus(v.status),
    reference: typeof v.reference === "string" ? v.reference : "",
  };
}

function readItems(data: FirebaseFirestore.DocumentData): QaItem[] {
  return Array.isArray(data.items) ? data.items.map(coerceItem) : [];
}

// --- reads -----------------------------------------------------------------

export async function listChecklists(): Promise<QaChecklistSummary[]> {
  await requireAuth();

  let snap;
  try {
    snap = await getDashboardDb().collection(COLLECTION).get();
  } catch {
    // Dashboard project unreachable — show an empty list rather than crashing.
    return [];
  }

  return snap.docs
    .map((doc) => {
      const d = doc.data();
      const items = readItems(d);
      const counts = emptyCounts();
      for (const it of items) counts[it.status]++;
      return {
        id: doc.id,
        name: typeof d.name === "string" ? d.name : "Untitled",
        appName: typeof d.appName === "string" ? d.appName : "",
        templateName: typeof d.templateName === "string" ? d.templateName : "Custom",
        total: items.length,
        counts,
        updatedAt:
          d.updatedAt?.toDate?.()?.toISOString() ??
          d.createdAt?.toDate?.()?.toISOString() ??
          "",
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getChecklist(id: string): Promise<QaChecklist | null> {
  await requireAuth();

  const doc = await getDashboardDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  const d = doc.data()!;

  return {
    id: doc.id,
    name: typeof d.name === "string" ? d.name : "Untitled",
    appName: typeof d.appName === "string" ? d.appName : "",
    templateId: typeof d.templateId === "string" ? d.templateId : "blank",
    templateName: typeof d.templateName === "string" ? d.templateName : "Custom",
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? "",
    updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? "",
    createdBy: typeof d.createdBy === "string" ? d.createdBy : "admin",
    items: readItems(d),
  };
}

// --- writes ----------------------------------------------------------------

export async function createChecklist(input: {
  name: string;
  appName: string;
  templateId: string;
}): Promise<CreateResult> {
  try {
    const session = await requireAuth();

    const name = input.name?.trim();
    if (!name) return { success: false, error: "A checklist name is required." };

    const template = getTemplate(input.templateId);
    if (!template) return { success: false, error: "Unknown template." };

    const items: QaItem[] = template.items.map((it) => ({
      id: randomUUID(),
      section: it.section,
      criterion: it.criterion,
      status: "pending",
      reference: "",
    }));

    const ref = await getDashboardDb().collection(COLLECTION).add({
      name,
      appName: input.appName?.trim() ?? "",
      templateId: template.id,
      templateName: template.name,
      items,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: session.user?.email ?? "admin",
    });

    revalidatePath("/qa");
    return { success: true, id: ref.id };
  } catch (err) {
    console.error("createChecklist error:", err);
    return { success: false, error: "Failed to create checklist" };
  }
}

// Shared read-modify-write for the inline `items` array. `fn` returns the new
// array, or null to signal "not found / no change".
async function mutateItems(
  checklistId: string,
  fn: (items: QaItem[]) => QaItem[] | null,
): Promise<ActionResult> {
  const ref = getDashboardDb().collection(COLLECTION).doc(checklistId);
  const doc = await ref.get();
  if (!doc.exists) return { success: false, error: "Checklist not found" };

  const next = fn(readItems(doc.data()!));
  if (next === null) return { success: false, error: "Item not found" };

  await ref.update({ items: next, updatedAt: FieldValue.serverTimestamp() });
  revalidatePath(`/qa/${checklistId}`);
  revalidatePath("/qa");
  return { success: true };
}

export async function setItemStatus(
  checklistId: string,
  itemId: string,
  status: QaStatus,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const clean = normalizeStatus(status);
    return await mutateItems(checklistId, (items) => {
      const i = items.findIndex((x) => x.id === itemId);
      if (i < 0) return null;
      items[i] = { ...items[i], status: clean };
      return items;
    });
  } catch (err) {
    console.error("setItemStatus error:", err);
    return { success: false, error: "Failed to update status" };
  }
}

export async function setItemReference(
  checklistId: string,
  itemId: string,
  reference: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const value = reference.slice(0, 500);
    return await mutateItems(checklistId, (items) => {
      const i = items.findIndex((x) => x.id === itemId);
      if (i < 0) return null;
      items[i] = { ...items[i], reference: value };
      return items;
    });
  } catch (err) {
    console.error("setItemReference error:", err);
    return { success: false, error: "Failed to save note" };
  }
}

export async function addItem(
  checklistId: string,
  section: string,
  criterion: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    const s = section.trim() || "General";
    const c = criterion.trim();
    if (!c) return { success: false, error: "A criterion is required." };

    return await mutateItems(checklistId, (items) => {
      items.push({
        id: randomUUID(),
        section: s,
        criterion: c,
        status: "pending",
        reference: "",
      });
      return items;
    });
  } catch (err) {
    console.error("addItem error:", err);
    return { success: false, error: "Failed to add item" };
  }
}

export async function deleteItem(
  checklistId: string,
  itemId: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    return await mutateItems(checklistId, (items) => {
      const next = items.filter((x) => x.id !== itemId);
      return next.length === items.length ? null : next;
    });
  } catch (err) {
    console.error("deleteItem error:", err);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function deleteChecklist(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    await getDashboardDb().collection(COLLECTION).doc(id).delete();
    revalidatePath("/qa");
    return { success: true };
  } catch (err) {
    console.error("deleteChecklist error:", err);
    return { success: false, error: "Failed to delete checklist" };
  }
}
