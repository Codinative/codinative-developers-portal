# Stores Management - Implementation Plan

> **Status:** Approved, ready to build.
> **Branch:** `feat/stores-management`.
> **Goal:** A **Stores** section in this dashboard to manage the BigCommerce apps' installed stores
> centrally - see every install, comp/un-comp billing, and provision a store directly - instead of
> hand-editing each app's Firestore.

---

## 1. Why this lives in the dashboard (not in the apps)

The merchant-facing BigCommerce apps should stay merchant-facing. Central store administration is an
**internal, Codinative-only** concern - and this dashboard already has everything it needs:

- **Admin auth** (NextAuth team logins, everything gated by `middleware.ts`).
- **Server-side Firestore** via `firebase-admin` (`lib/firebase-admin.ts`).
- An **AES secrets vault** (`lib/crypto.ts`, `actions/secrets.ts`) - the natural home for each app's
  service-account credentials.
- A **server-action pattern** (`actions/*` with `requireAuth()` first) to model new admin actions on.

So we add a section here rather than building (and securing) an admin panel inside each app.

---

## 2. The key enabler (already present)

[`lib/firebase-admin.ts`](../lib/firebase-admin.ts) exposes a generic `dbFor(name, creds)` that
initializes a **named** Admin app per credential set; `getDashboardDb()` is just the `"dashboard"`
one. So connecting to each app's **own** Firebase project is a few lines:

```ts
export function getAppDb(appKey: "signup" | "shipping"): Firestore {
  return dbFor(appKey, credsFromEnvOrVault(appKey)); // SIGNUP_FIREBASE_* / SHIPPING_FIREBASE_*
}
```

Each app keeps its data in its own project; the dashboard reads/writes that project's `stores`
collection through a named Admin app. No changes required in the apps themselves for read/comp/provision.

---

## 3. What each app's `stores/{storeHash}` doc holds (what we read)

Common, normalized into a single "store" view in the UI:

| Field | Meaning |
|---|---|
| doc id (`storeHash`) | The BigCommerce store hash |
| `accessToken` | API token (secret - **never shown in the UI**, used server-side only) |
| `adminId` / owner email (via `users`) | Store owner |
| `subscriptionStatus` | `none` / `trialing` / `active` / `past_due` / `canceled` |
| `setupFeePaid`, `trialEndsAt`, `stripeCustomerId` | Billing state |
| `signupScriptUuid` / `channelForms` (signup app) | Install / channel status |
| `uninstalled`, `uninstalledAt` | Soft-delete state |

(Per-app extras, e.g. shipping's pricing/carrier, can appear in a per-app detail view later.)

---

## 4. Features (phased)

### Phase 1 - Read-only stores list (per app)
- New route `app/(dashboard)/stores/page.tsx` + `actions/stores.ts` (`requireAuth()` first).
- Pick an app (signup / shipping) -> list its installs: store hash, owner, install/uninstall state,
  `subscriptionStatus`, billing flags, install/channel status, signup-request counts.
- Read-only. No tokens shown.

### Phase 2 - Actions
- **Comp / un-comp** a store: set `subscriptionStatus: "active"` (+ `setupFeePaid`, `setupFeeQueued`)
  - the exact thing currently done by hand in Firestore, as a button.
- **Provision** a store directly: write a `stores/{hash}` doc from a pasted store hash + API token
  (the "direct access without OAuth install" path), reusing the app's expected doc shape.
- **Re-sync / soft-uninstall** as needed.
- Every mutating action writes an **audit log** entry (below).

### Phase 3 - Per-app detail views (optional)
- Signup app: per-store channels/forms status.
- Shipping app: pricing strategy / carrier status.

---

## 5. Security (this is the sensitive part)

This dashboard will hold **service-account credentials for every app's Firebase project** and can
touch **every merchant's billing and access token**. So:

- **Credentials** live in the **secrets vault** (or `*_FIREBASE_*` env vars), never in code, never in
  the browser. Decrypted only server-side inside a Server Action.
- **All actions server-side**, behind the existing NextAuth gate; each calls `requireAuth()` first.
- **Never render access tokens** in the UI (mask/omit). They're used server-side only.
- **Audit log**: a new dashboard collection `storeAuditLog` records every mutating action
  - `{ actor (session user), app, storeHash, action, before, after, at }`. Comp/provision must be
  traceable.
- Each app's `firestore.rules` stay locked (`if false`); the Admin SDK bypasses them, browsers are
  blocked - unchanged.
- Least privilege: ideally per-app service accounts scoped to what's needed.

---

## 6. Open items / decisions

- **Apps in scope first:** signup + shipping (both Firebase-backed). Confirm.
- **Credentials source:** env vars (`SIGNUP_FIREBASE_*`, `SHIPPING_FIREBASE_*`) vs the in-app secrets
  vault. Recommend env vars for the service accounts (set in Vercel), vault for ad-hoc tokens.
- **Comp semantics:** confirm the exact field set per app that grants free access
  (signup: `subscriptionStatus:"active"` + `setupFeePaid:true`; verify shipping's gate).
- **Provision shape:** mirror each app's install doc exactly (signup: `accessToken`, `scope`,
  `adminId`, `publicStoreId`, `signupFormActive:false`).

---

## 7. Reference

- Dashboard: `lib/firebase-admin.ts` (`dbFor` / `getDashboardDb`), `actions/secrets.ts` +
  `lib/crypto.ts` (vault pattern), `actions/project-hub.ts` (action + UI pattern), `lib/auth.ts`
  (`requireAuth`), `app/(dashboard)/*` (route-group layout).
- Apps: `custom-signup-forms/lib/dbs/firebase.ts` (`stores` doc shape, subscription fields),
  `Custom-Shipping-Rules-App/lib/settings.ts` (per-store config). Related app-side plan:
  `custom-signup-forms/docs/multi-channel-forms-plan.md`.
