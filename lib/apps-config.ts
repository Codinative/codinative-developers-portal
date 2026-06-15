// ----------------------------------------------------------------------------
// Registry of every BigCommerce app the dashboard monitors.
//
// Real-world shape (verified against each app's lib/dbs/firebase.ts):
//   - top-level `stores/{storeHash}` → one doc per install  (the install count)
//   - top-level `users/{userId}`     → admin users
//   - app-specific data is either a top-level collection (e.g. `settings`) or a
//     sub-collection under each store (e.g. `stores/{hash}/signupRequests`),
//     which must be counted app-wide with a collectionGroup query.
// ----------------------------------------------------------------------------

export type MetricSpec =
  | { label: string; kind: "collection"; path: string }
  | { label: string; kind: "collectionGroup"; path: string };

export type AppConfig = {
  /** Stable id used in routes (/apps/[id]) and as the secrets `appId`. */
  id: string;
  name: string;
  description: string;
  /** Env-var prefix for this app's service account, e.g. "FB_SIGNUP". */
  envPrefix: string;
  /** Tailwind-ish accent color name used by the UI. */
  color: "blue" | "green" | "purple" | "amber" | "rose" | "slate";
  /** Headline metric — docs in the `stores` collection. */
  installs: MetricSpec;
  /** Additional metric cards. */
  metrics: MetricSpec[];
};

// Apps are now connected at runtime from the Settings page (Google OAuth or a
// pasted service-account JSON) and stored in Firestore — see lib/projects-store.ts.
// This static registry is the env-var-based alternative: add an entry here ONLY
// if you want an app wired purely through *_PROJECT_ID / *_CLIENT_EMAIL /
// *_PRIVATE_KEY env vars instead of the UI. Leaving it empty means the dashboard
// shows exactly what you connect in Settings (no placeholder/error cards).
//
// Example (uncomment + set FB_SIGNUP_* env vars to use):
// {
//   id: "custom-signup-forms",
//   name: "Custom Signup Forms",
//   description: "Custom BigCommerce signup forms & request management.",
//   envPrefix: "FB_SIGNUP",
//   color: "blue",
//   installs: { label: "Installs", kind: "collection", path: "stores" },
//   metrics: [
//     { label: "Admin users", kind: "collection", path: "users" },
//     { label: "Signup requests", kind: "collectionGroup", path: "signupRequests" },
//   ],
// },
export const APPS: AppConfig[] = [];

export function getAppById(id: string): AppConfig | undefined {
  return APPS.find((a) => a.id === id);
}
