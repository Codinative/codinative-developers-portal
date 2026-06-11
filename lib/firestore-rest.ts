// ----------------------------------------------------------------------------
// Firestore REST client used for Google-OAuth-connected projects (Phase 2).
// Service-account projects use the Admin SDK; OAuth projects are read with the
// connected user's access token via the public Firestore REST API. Server-only.
// ----------------------------------------------------------------------------

import { getGoogleAccessToken } from "@/lib/google-oauth";
import type { MetricSpec } from "@/lib/apps-config";
import type { StoreSample } from "@/lib/projects-store";

const BASE = "https://firestore.googleapis.com/v1";

function db(projectId: string): string {
  return `${BASE}/projects/${projectId}/databases/(default)/documents`;
}

// Count a collection (or sub-collection across all stores) with a server-side
// aggregation query — cheap, no documents transferred.
export async function countViaRest(
  projectId: string,
  spec: MetricSpec,
): Promise<number> {
  const token = await getGoogleAccessToken();
  const res = await fetch(`${db(projectId)}:runAggregationQuery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      structuredAggregationQuery: {
        structuredQuery: {
          from: [
            {
              collectionId: spec.path,
              allDescendants: spec.kind === "collectionGroup",
            },
          ],
        },
        aggregations: [{ alias: "count", count: {} }],
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Firestore count failed (${res.status})`);
  }
  const data = (await res.json()) as Array<{
    result?: { aggregateFields?: { count?: { integerValue?: string } } };
  }>;
  for (const entry of data ?? []) {
    const value = entry?.result?.aggregateFields?.count?.integerValue;
    if (value != null) return Number(value);
  }
  return 0;
}

// Best-effort sample of store docs for the activity feed.
export async function listDocsViaRest(
  projectId: string,
  path: string,
  max: number,
): Promise<StoreSample[]> {
  try {
    const token = await getGoogleAccessToken();
    const res = await fetch(
      `${db(projectId)}/${encodeURIComponent(path)}?pageSize=${max}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      documents?: { name?: string; fields?: Record<string, FirestoreValue> }[];
    };
    return (data.documents ?? []).map((doc) => {
      const id = String(doc.name ?? "").split("/").pop() ?? "";
      const f = doc.fields ?? {};
      return {
        storeHash: id,
        scope: f.scope?.stringValue,
        subscriptionStatus: f.subscriptionStatus?.stringValue,
        uninstalled: Boolean(f.uninstalled?.booleanValue || f.uninstalledAt),
      };
    });
  } catch {
    return [];
  }
}

type FirestoreValue = {
  stringValue?: string;
  booleanValue?: boolean;
  // other typed fields exist but aren't needed here
};
