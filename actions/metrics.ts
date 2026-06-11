"use server";

import { auth } from "@/lib/auth";
import {
  getEffectiveApps,
  getEffectiveAppById,
  type EffectiveApp,
  type AccentColor,
} from "@/lib/projects-store";

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

async function resolveApp(app: EffectiveApp): Promise<AppMetrics> {
  const base = {
    id: app.id,
    name: app.name,
    description: app.description,
    color: app.color,
    installsLabel: app.installs.label,
  };
  try {
    const installs = await app.count(app.installs);
    const metrics = await Promise.all(
      app.metrics.map(async (m) => ({
        label: m.label,
        count: await app.count(m),
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
    return await app.listStores(app.installs.path, max);
  } catch {
    return [];
  }
}
