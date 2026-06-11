// ----------------------------------------------------------------------------
// Connected-Firebase config store.
//
// Instead of (only) reading monitored-app credentials from env vars, the
// dashboard can store them in its OWN Firestore project — added from the
// Settings UI by pasting a service-account JSON. The private key is AES-encrypted
// at rest (same key as the secrets vault) and only ever decrypted server-side.
//
// `getEffectiveApps()` merges the two sources: the static env-based registry in
// apps-config.ts plus anything connected through the UI, with stored projects
// taking precedence when ids collide. This module is server-only (it imports
// firebase-admin + crypto) — never import it from a Client Component.
// ----------------------------------------------------------------------------

import {
  FieldValue,
  type Firestore,
  type DocumentData,
} from "firebase-admin/firestore";
import {
  getDashboardDb,
  getAppDb,
  getDbFromCreds,
} from "@/lib/firebase-admin";
import { encrypt, decrypt } from "@/lib/crypto";
import { countViaRest, listDocsViaRest } from "@/lib/firestore-rest";
import { APPS, type AppConfig, type MetricSpec } from "@/lib/apps-config";

export type AccentColor = AppConfig["color"];

/** How a connected project's Firestore is read. */
export type ConnectionKind = "service-account" | "google";

/** A sampled store doc for the activity feed (source-agnostic). */
export type StoreSample = {
  storeHash: string;
  scope?: string;
  subscriptionStatus?: string;
  uninstalled: boolean;
};

const ACCENT_COLORS: AccentColor[] = [
  "blue",
  "green",
  "purple",
  "amber",
  "rose",
  "slate",
];

const COLLECTION = "firebaseProjects";

// A connected project as stored (private key decrypted, server-side only).
type ProjectRecord = {
  id: string; // Firestore doc id
  appId: string; // slug used in routes + as the secrets appId
  name: string;
  description: string;
  color: AccentColor;
  connection: ConnectionKind;
  firebaseProjectId: string;
  clientEmail: string;
  privateKey: string; // decrypted — NEVER send this to the browser
  installs: MetricSpec;
  metrics: MetricSpec[];
};

// Browser-safe view of a connected project (no private key).
export type ProjectSummary = {
  id: string;
  appId: string;
  name: string;
  description: string;
  color: AccentColor;
  connection: ConnectionKind;
  firebaseProjectId: string;
  clientEmailMasked: string;
  metricLabels: string[];
  status: "live" | "error";
  error?: string;
};

// Source-agnostic counters: a project reads via either the Admin SDK
// (service-account) or the Firestore REST API (Google OAuth).
type Counters = {
  count: (spec: MetricSpec) => Promise<number>;
  listStores: (path: string, max: number) => Promise<StoreSample[]>;
};

// A resolved app the rest of the dashboard iterates over, regardless of whether
// it came from env vars, a stored service account, or a connected Google account.
export type EffectiveApp = {
  id: string;
  name: string;
  description: string;
  color: AccentColor;
  installs: MetricSpec;
  metrics: MetricSpec[];
  source: "env" | "store" | "google";
} & Counters;

export type ConnectInput = {
  name: string;
  serviceAccountJson: string;
  color?: string;
  installsPath?: string;
  /** Extra metric collections, comma/newline separated. Prefix `group:` for a
   *  collectionGroup query (counts a sub-collection across all stores). */
  extraMetrics?: string;
};

export type ActionResult = { success: boolean; error?: string };

// --- helpers ---------------------------------------------------------------

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeColor(color?: string): AccentColor {
  return ACCENT_COLORS.includes(color as AccentColor)
    ? (color as AccentColor)
    : "slate";
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "•••";
  const head = local.slice(0, 3);
  return `${head}${"•".repeat(Math.max(local.length - 3, 3))}@${domain}`;
}

// Parse a comma/newline list of metric collections into specs.
//   "promos, group:signupRequests"  →
//   [{label:"promos",collection,…}, {label:"signupRequests",collectionGroup,…}]
function parseExtraMetrics(raw?: string): MetricSpec[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const isGroup = entry.toLowerCase().startsWith("group:");
      const path = (isGroup ? entry.slice(6) : entry).trim();
      return isGroup
        ? { label: path, kind: "collectionGroup" as const, path }
        : { label: path, kind: "collection" as const, path };
    })
    .filter((m) => m.path.length > 0);
}

type ParsedServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function parseServiceAccount(json: string): ParsedServiceAccount {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(
      "Service account is not valid JSON — paste the full downloaded key file.",
    );
  }
  const projectId = parsed.project_id;
  const clientEmail = parsed.client_email;
  const privateKey = parsed.private_key;
  if (
    typeof projectId !== "string" ||
    typeof clientEmail !== "string" ||
    typeof privateKey !== "string"
  ) {
    throw new Error(
      "Service account JSON is missing project_id, client_email or private_key.",
    );
  }
  return { projectId, clientEmail, privateKey };
}

// Read a stored MetricSpec defensively (data came from Firestore).
function coerceSpec(value: unknown, fallback: MetricSpec): MetricSpec {
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    if (
      typeof v.label === "string" &&
      typeof v.path === "string" &&
      (v.kind === "collection" || v.kind === "collectionGroup")
    ) {
      return { label: v.label, kind: v.kind, path: v.path } as MetricSpec;
    }
  }
  return fallback;
}

// --- reads -----------------------------------------------------------------

// Internal: full records incl. decrypted private key. Server-side only.
async function readRecords(): Promise<ProjectRecord[]> {
  let snap;
  try {
    snap = await getDashboardDb().collection(COLLECTION).orderBy("name").get();
  } catch {
    // Dashboard project unreachable — fall back to env-only apps elsewhere.
    return [];
  }
  return snap.docs.map((doc) => {
    const d = doc.data();
    let privateKey = "";
    try {
      privateKey = decrypt(d.privateKey);
    } catch {
      privateKey = "";
    }
    const installs = coerceSpec(d.installs, {
      label: "Installs",
      kind: "collection",
      path: "stores",
    });
    const metrics = Array.isArray(d.metrics)
      ? d.metrics.map((m: unknown) =>
          coerceSpec(m, { label: "users", kind: "collection", path: "users" }),
        )
      : [];
    return {
      id: doc.id,
      appId: typeof d.appId === "string" ? d.appId : doc.id,
      name: typeof d.name === "string" ? d.name : doc.id,
      description: typeof d.description === "string" ? d.description : "",
      color: normalizeColor(d.color),
      connection: d.connection === "google" ? "google" : "service-account",
      firebaseProjectId:
        typeof d.firebaseProjectId === "string" ? d.firebaseProjectId : "",
      clientEmail: typeof d.clientEmail === "string" ? d.clientEmail : "",
      privateKey,
      installs,
      metrics,
    };
  });
}

// Map a raw store doc into the source-agnostic sample shape.
function mapStoreData(data: DocumentData): Omit<StoreSample, "storeHash"> {
  return {
    scope: typeof data.scope === "string" ? data.scope : undefined,
    subscriptionStatus:
      typeof data.subscriptionStatus === "string"
        ? data.subscriptionStatus
        : undefined,
    uninstalled: Boolean(data.uninstalled || data.uninstalledAt),
  };
}

// Counters backed by the Admin SDK (env + service-account projects).
function adminCounters(getDb: () => Firestore): Counters {
  return {
    count: async (spec) => {
      const ref =
        spec.kind === "collectionGroup"
          ? getDb().collectionGroup(spec.path)
          : getDb().collection(spec.path);
      return (await ref.count().get()).data().count;
    },
    listStores: async (path, max) => {
      const snap = await getDb().collection(path).limit(max).get();
      return snap.docs.map((d) => ({
        storeHash: d.id,
        ...mapStoreData(d.data()),
      }));
    },
  };
}

// Counters backed by the Firestore REST API (Google-OAuth projects).
function googleCounters(projectId: string): Counters {
  return {
    count: (spec) => countViaRest(projectId, spec),
    listStores: (path, max) => listDocsViaRest(projectId, path, max),
  };
}

function countersFor(r: ProjectRecord): Counters {
  return r.connection === "google"
    ? googleCounters(r.firebaseProjectId)
    : adminCounters(() =>
        getDbFromCreds(r.firebaseProjectId || r.appId, {
          projectId: r.firebaseProjectId,
          clientEmail: r.clientEmail,
          privateKey: r.privateKey,
        }),
      );
}

function recordToEffective(r: ProjectRecord): EffectiveApp {
  return {
    id: r.appId,
    name: r.name,
    description: r.description,
    color: r.color,
    installs: r.installs,
    metrics: r.metrics,
    source: r.connection === "google" ? "google" : "store",
    ...countersFor(r),
  };
}

function envToEffective(a: AppConfig): EffectiveApp {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    color: a.color,
    installs: a.installs,
    metrics: a.metrics,
    source: "env",
    ...adminCounters(() => getAppDb(a.envPrefix)),
  };
}

/** Every app the dashboard should show: env registry + connected projects,
 *  stored projects winning on id collisions. */
export async function getEffectiveApps(): Promise<EffectiveApp[]> {
  const records = await readRecords();
  const byId = new Map<string, EffectiveApp>();
  for (const a of APPS) byId.set(a.id, envToEffective(a));
  for (const r of records) byId.set(r.appId, recordToEffective(r));
  return [...byId.values()];
}

export async function getEffectiveAppById(
  id: string,
): Promise<EffectiveApp | null> {
  const apps = await getEffectiveApps();
  return apps.find((a) => a.id === id) ?? null;
}

/** firebaseProjectIds already added to the dashboard — used to mark which
 *  Google-discovered projects are already monitored. */
export async function listProjectFirebaseIds(): Promise<string[]> {
  const records = await readRecords();
  return records.map((r) => r.firebaseProjectId).filter(Boolean);
}

/** Browser-safe summaries for the Settings page, each with a live/error status
 *  from a lightweight connectivity probe. */
export async function listProjectSummaries(): Promise<ProjectSummary[]> {
  const records = await readRecords();
  return Promise.all(
    records.map(async (r) => {
      let status: "live" | "error" = "live";
      let error: string | undefined;
      try {
        await countersFor(r).count(r.installs);
      } catch {
        status = "error";
        error =
          r.connection === "google"
            ? "Could not read this project (re-connect Google or check Firestore)."
            : "Could not read this project's Firestore (check the key).";
      }
      return {
        id: r.id,
        appId: r.appId,
        name: r.name,
        description: r.description,
        color: r.color,
        connection: r.connection,
        firebaseProjectId: r.firebaseProjectId,
        clientEmailMasked:
          r.connection === "google"
            ? "via Google account"
            : maskEmail(r.clientEmail),
        metricLabels: [r.installs.label, ...r.metrics.map((m) => m.label)],
        status,
        error,
      };
    }),
  );
}

// --- writes ----------------------------------------------------------------

export async function addProjectRecord(
  input: ConnectInput,
  addedBy: string,
): Promise<ActionResult> {
  const name = input.name?.trim();
  if (!name) return { success: false, error: "A display name is required." };

  let sa: ParsedServiceAccount;
  try {
    sa = parseServiceAccount(input.serviceAccountJson);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid service account.",
    };
  }

  const appId = slugify(name);
  if (!appId)
    return { success: false, error: "Name must contain letters or numbers." };

  const installsPath = input.installsPath?.trim() || "stores";
  const installs: MetricSpec = {
    label: "Installs",
    kind: "collection",
    path: installsPath,
  };
  const metrics: MetricSpec[] = [
    { label: "Admin users", kind: "collection", path: "users" },
    ...parseExtraMetrics(input.extraMetrics),
  ];

  const db = getDashboardDb();

  // Reject a duplicate slug.
  const existing = await db
    .collection(COLLECTION)
    .where("appId", "==", appId)
    .limit(1)
    .get();
  if (!existing.empty) {
    return {
      success: false,
      error: `A project named "${name}" (id "${appId}") already exists.`,
    };
  }

  // Verify the credentials actually work before storing them.
  try {
    await getDbFromCreds(sa.projectId, {
      projectId: sa.projectId,
      clientEmail: sa.clientEmail,
      privateKey: sa.privateKey,
    })
      .collection(installsPath)
      .limit(1)
      .get();
  } catch {
    return {
      success: false,
      error:
        "Connected, but couldn't read Firestore with this service account. " +
        "Check that Firestore is enabled and the account has read access.",
    };
  }

  await db.collection(COLLECTION).add({
    appId,
    name,
    description: `Firebase project ${sa.projectId}`,
    color: normalizeColor(input.color),
    connection: "service-account",
    firebaseProjectId: sa.projectId,
    clientEmail: sa.clientEmail,
    privateKey: encrypt(sa.privateKey), // encrypted at rest
    installs,
    metrics,
    addedAt: FieldValue.serverTimestamp(),
    addedBy,
  });

  return { success: true };
}

/** Add a Firebase project discovered through the connected Google account.
 *  No service-account key is stored — reads go through the OAuth token. */
export async function addGoogleProjectRecord(
  projectId: string,
  displayName: string,
  addedBy: string,
): Promise<ActionResult> {
  if (!projectId) return { success: false, error: "Missing project id." };
  const name = displayName?.trim() || projectId;
  const appId = slugify(name) || slugify(projectId);
  if (!appId)
    return { success: false, error: "Could not derive an id for this project." };

  const db = getDashboardDb();

  const dupSlug = await db
    .collection(COLLECTION)
    .where("appId", "==", appId)
    .limit(1)
    .get();
  if (!dupSlug.empty) {
    return {
      success: false,
      error: `"${name}" (id "${appId}") is already added.`,
    };
  }
  const dupProject = await db
    .collection(COLLECTION)
    .where("firebaseProjectId", "==", projectId)
    .limit(1)
    .get();
  if (!dupProject.empty) {
    return { success: false, error: `Project ${projectId} is already added.` };
  }

  const installs: MetricSpec = {
    label: "Installs",
    kind: "collection",
    path: "stores",
  };
  const metrics: MetricSpec[] = [
    { label: "Admin users", kind: "collection", path: "users" },
  ];

  // Verify we can actually read it through the OAuth token before adding.
  try {
    await googleCounters(projectId).count(installs);
  } catch {
    return {
      success: false,
      error:
        "Connected to Google, but couldn't read this project's Firestore. " +
        "Make sure Firestore is enabled on it.",
    };
  }

  await db.collection(COLLECTION).add({
    appId,
    name,
    description: `Firebase project ${projectId} (via Google)`,
    color: "slate",
    connection: "google",
    firebaseProjectId: projectId,
    installs,
    metrics,
    addedAt: FieldValue.serverTimestamp(),
    addedBy,
  });

  return { success: true };
}

export async function deleteProjectRecord(id: string): Promise<ActionResult> {
  if (!id) return { success: false, error: "Missing project id." };
  await getDashboardDb().collection(COLLECTION).doc(id).delete();
  return { success: true };
}
