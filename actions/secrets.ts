"use server";

import { auth } from "@/lib/auth";
import { getDashboardDb } from "@/lib/firebase-admin";
import { encrypt, decrypt } from "@/lib/crypto";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

// Auth guard — call this at the top of every action.
async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export type Secret = {
  id: string;
  appId: string;
  key: string;
  value: string; // decrypted — only returned server-side to the authed session
  addedAt: string;
  addedBy: string;
};

type ActionResult = { success: boolean; error?: string };

// Fetch all secrets for an app (decrypted server-side).
export async function getSecretsByApp(appId: string): Promise<Secret[]> {
  await requireAuth();

  // Filter by appId only (no orderBy) so Firestore doesn't require a composite
  // index — the vault is small, so we sort newest-first in memory.
  const snap = await getDashboardDb()
    .collection("secrets")
    .where("appId", "==", appId)
    .get();

  return snap.docs
    .map((doc) => {
      const data = doc.data();
      let decryptedValue = "";
      try {
        decryptedValue = decrypt(data.value);
      } catch {
        decryptedValue = "[decryption error]";
      }
      return {
        id: doc.id,
        appId: data.appId,
        key: data.key,
        value: decryptedValue,
        addedAt: data.addedAt?.toDate?.()?.toISOString() ?? "",
        addedBy: data.addedBy ?? "unknown",
      };
    })
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

// Add a new secret (stored encrypted).
export async function addSecret(
  appId: string,
  key: string,
  value: string,
): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    if (!appId || !key || !value) {
      return { success: false, error: "All fields are required" };
    }

    const db = getDashboardDb();

    // Reject duplicate key within the same app.
    const existing = await db
      .collection("secrets")
      .where("appId", "==", appId)
      .where("key", "==", key)
      .get();

    if (!existing.empty) {
      return { success: false, error: `Key "${key}" already exists for this app` };
    }

    await db.collection("secrets").add({
      appId,
      key,
      value: encrypt(value), // always store encrypted
      addedAt: FieldValue.serverTimestamp(),
      addedBy: session.user?.email ?? "admin",
    });

    revalidatePath("/secrets");
    return { success: true };
  } catch (err) {
    // Never log the decrypted value; the error object carries no plaintext here.
    console.error("addSecret error:", err);
    return { success: false, error: "Failed to save secret" };
  }
}

// Update an existing secret's value.
export async function updateSecret(
  secretId: string,
  newValue: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!newValue) return { success: false, error: "Value cannot be empty" };

    await getDashboardDb().collection("secrets").doc(secretId).update({
      value: encrypt(newValue),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath("/secrets");
    return { success: true };
  } catch (err) {
    console.error("updateSecret error:", err);
    return { success: false, error: "Failed to update secret" };
  }
}

// Delete a secret.
export async function deleteSecret(secretId: string): Promise<ActionResult> {
  try {
    await requireAuth();
    await getDashboardDb().collection("secrets").doc(secretId).delete();
    revalidatePath("/secrets");
    return { success: true };
  } catch (err) {
    console.error("deleteSecret error:", err);
    return { success: false, error: "Failed to delete secret" };
  }
}
