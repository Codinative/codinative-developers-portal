// ----------------------------------------------------------------------------
// Google OAuth (Phase 2) — "Connect a Google account" so the dashboard can
// auto-discover the Firebase projects that account owns and read their
// Firestore data via the user's own identity (no service-account JSON needed).
//
// This is a connection, NOT the dashboard login — you still sign in with the
// admin email/password. The refresh token is AES-encrypted and stored in the
// dashboard's own Firestore (`appConfig/google`); access tokens are fetched on
// demand and cached in memory for their lifetime. Server-only.
// ----------------------------------------------------------------------------

import { FieldValue } from "firebase-admin/firestore";
import { getDashboardDb } from "@/lib/firebase-admin";
import { encrypt, decrypt } from "@/lib/crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const FIREBASE_PROJECTS_URL =
  "https://firebase.googleapis.com/v1beta1/projects?pageSize=200";

// Read-only access to Firebase project metadata and Firestore data.
const SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/cloud-platform.read-only",
];

const DOC = { collection: "appConfig", id: "google" } as const;

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  id_token?: string;
};

export type DiscoveredProject = { projectId: string; displayName: string };

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function buildAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline", // ask for a refresh token
    prompt: "consent", // force refresh-token issuance every time
    include_granted_scopes: "true",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function exchangeCode(
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed: ${res.status}`);
  }
  return (await res.json()) as TokenResponse;
}

async function fetchEmail(accessToken: string): Promise<string> {
  try {
    const res = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return "";
    const data = (await res.json()) as { email?: string };
    return data.email ?? "";
  } catch {
    return "";
  }
}

// Persist the connection (called from the OAuth callback route).
export async function connectGoogleFromCode(
  code: string,
  redirectUri: string,
): Promise<void> {
  const tokens = await exchangeCode(code, redirectUri);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token — disconnect and re-consent.",
    );
  }
  const email = await fetchEmail(tokens.access_token);
  await getDashboardDb()
    .collection(DOC.collection)
    .doc(DOC.id)
    .set(
      {
        refreshToken: encrypt(tokens.refresh_token),
        email,
        connectedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  cachedAccessToken = null;
}

export async function getGoogleConnection(): Promise<{ email: string } | null> {
  try {
    const doc = await getDashboardDb()
      .collection(DOC.collection)
      .doc(DOC.id)
      .get();
    if (!doc.exists) return null;
    const d = doc.data();
    if (d && typeof d.refreshToken === "string") {
      return { email: typeof d.email === "string" ? d.email : "" };
    }
    return null;
  } catch {
    return null;
  }
}

export async function disconnectGoogle(): Promise<void> {
  cachedAccessToken = null;
  await getDashboardDb().collection(DOC.collection).doc(DOC.id).delete();
}

// In-memory access-token cache (single admin; instances are reused on Fluid
// Compute, so this avoids a refresh round-trip on every read).
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export async function getGoogleAccessToken(): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }

  const doc = await getDashboardDb()
    .collection(DOC.collection)
    .doc(DOC.id)
    .get();
  if (!doc.exists) throw new Error("Google account is not connected");
  const enc = doc.data()?.refreshToken;
  if (typeof enc !== "string") throw new Error("Google account is not connected");
  const refreshToken = decrypt(enc);

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to refresh Google access token: ${res.status}`);
  }
  const data = (await res.json()) as TokenResponse;
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedAccessToken.token;
}

// List every Firebase project the connected account can see.
export async function listFirebaseProjects(): Promise<DiscoveredProject[]> {
  const token = await getGoogleAccessToken();
  const res = await fetch(FIREBASE_PROJECTS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Firebase Management API error: ${res.status}`);
  }
  const data = (await res.json()) as {
    results?: { projectId?: string; displayName?: string }[];
  };
  return (data.results ?? [])
    .filter((p): p is { projectId: string; displayName?: string } =>
      Boolean(p.projectId),
    )
    .map((p) => ({
      projectId: p.projectId,
      displayName: p.displayName ?? p.projectId,
    }));
}
