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

export const APPS: AppConfig[] = [
  {
    id: "custom-signup-forms",
    name: "Custom Signup Forms",
    description:
      "Custom BigCommerce signup forms, email templates & request management.",
    envPrefix: "FB_SIGNUP", // project: bc-signup-customisation-app
    color: "blue",
    installs: { label: "Installs", kind: "collection", path: "stores" },
    metrics: [
      { label: "Admin users", kind: "collection", path: "users" },
      {
        label: "Signup requests",
        kind: "collectionGroup",
        path: "signupRequests",
      },
      { label: "Form versions", kind: "collectionGroup", path: "formVersions" },
    ],
  },
  {
    id: "weight-based-shipping-charge",
    name: "Weight-Based Shipping",
    description:
      "UPS weight-based shipping rate provider for BigCommerce checkout.",
    envPrefix: "FB_WEIGHT", // project: bc-weight-based-shipping
    color: "green",
    installs: { label: "Installs", kind: "collection", path: "stores" },
    metrics: [
      { label: "Admin users", kind: "collection", path: "users" },
      { label: "Settings docs", kind: "collection", path: "settings" },
    ],
  },
  // To add `shipping` / `shipping-app`: copy an entry above, set a fresh
  // envPrefix (e.g. FB_SHIPPING) and add the matching *_PROJECT_ID /
  // *_CLIENT_EMAIL / *_PRIVATE_KEY env vars for that project's service account.
];

export function getAppById(id: string): AppConfig | undefined {
  return APPS.find((a) => a.id === id);
}
