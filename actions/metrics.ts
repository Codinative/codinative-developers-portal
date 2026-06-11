"use server";

import { auth } from "@/lib/auth";
import {
  getEffectiveApps,
  getEffectiveAppById,
  type EffectiveApp,
  type AccentColor,
} from "@/lib/projects-store";
import type { MetricSpec } from "@/lib/apps-config";
import type { Firestore } from "firebase-admin/firestore";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export type ResolvedMetric = { label: string; count: number };

export type AppMetrics = {
  id: string;
  name: string;
  description: string;
  color: AccentColor;
  installs: number;
  installsLabel: string;
  metrics: ResolvedMetric[];
  status: "live" | "error";
  error?: string;
};

export type StoreActivity = {
  storeHash: string;
  scope?: string;
  subscriptionStatus?: string;
  uninstalled: boolean;
};

// Count a metric spec, transparently using a collectionGroup query for
// sub-collections (e.g. stores/{hash}/signupRequests).
async function countSpec(db: Firestore, spec: MetricSpec): Promise<number> {
  const ref =
    spec.kind === "collectionGroup"
      ? db.collectionGroup(spec.path)
      : db.collection(spec.path);
  const snap = await ref.count().get();
  return snap.data().count;
}

async function resolveApp(app: EffectiveApp): Promise<AppMetrics> {
  const base = {
    id: app.id,
    name: app.name,
    description: app.description,
    color: app.color,
    installsLabel: app.installs.label,
  };
  try {
    const db = app.getDb();
    const installs = await countSpec(db, app.installs);
    const metrics = await Promise.all(
      app.metrics.map(async (m) => ({
        label: m.label,
        count: await countSpec(db, m),
      })),
    );
    return { ...base, installs, metrics, status: "live" };
  } catch (err) {
    // Surface a friendly status; don't crash the whole page if one project's
    // service account is missing/misconfigured.
    console.error(
      `metrics error for ${app.id}:`,
      err instanceof Error ? err.message : err,
    );
    return {
      ...base,
      installs: 0,
      metrics: [],
      status: "error",
      error:
        app.source === "store"
          ? "Could not read this project's Firestore (re-connect it in Settings)."
          : "Could not read this app's Firestore project (check its service-account env vars).",
    };
  }
}

export async function getAllAppMetrics(): Promise<AppMetrics[]> {
  await requireAuth();
  const apps = await getEffectiveApps();
  return Promise.all(apps.map(resolveApp));
}

export async function getAppMetric(appId: string): Promise<AppMetrics | null> {
  await requireAuth();
  const app = await getEffectiveAppById(appId);
  if (!app) return null;
  return resolveApp(app);
}

// Best-effort recent-install sample. The monitored apps don't all write a
// consistent timestamp on store docs, so this returns an unordered sample
// rather than a strict chronological feed.
export async function getRecentStores(
  appId: string,
  max = 8,
): Promise<StoreActivity[]> {
  await requireAuth();
  const app = await getEffectiveAppById(appId);
  if (!app) return [];
  try {
    const snap = await app
      .getDb()
      .collection(app.installs.path)
      .limit(max)
      .get();
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        storeHash: d.id,
        scope: typeof data.scope === "string" ? data.scope : undefined,
        subscriptionStatus:
          typeof data.subscriptionStatus === "string"
            ? data.subscriptionStatus
            : undefined,
        uninstalled: Boolean(data.uninstalled || data.uninstalledAt),
      };
    });
  } catch {
    return [];
  }
}
