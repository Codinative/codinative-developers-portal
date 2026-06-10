# Architecture

The mental model for the dashboard, the non‑obvious decisions, and where things
live. Read this before making structural changes.

---

## What the app does

1. **Overview** (`/`) — one card per BigCommerce app with its live install count
   and status.
2. **App detail** (`/apps/[appId]`) — per‑app metric breakdown + a sample of
   stores.
3. **Secrets vault** (`/secrets`) — AES‑encrypted key/value store for API keys
   and tokens, grouped per app.
4. Everything except `/login` is behind a single admin login.

---

## The one decision that shapes everything: multiple Firebase projects

Each BigCommerce app is deployed as **its own Firebase project**, e.g.:

| App | Firebase project |
|---|---|
| `custom-signup-forms` | `bc-signup-customisation-app` |
| `weight-based-shipping-charge` | `bc-weight-based-shipping` |

There is no single shared database, so the dashboard cannot use one Firestore
client. Instead:

- [`lib/firebase-admin.ts`](../lib/firebase-admin.ts) lazily initializes **one
  named Firebase Admin app per project** and caches it. Credentials are resolved
  from env vars by **prefix**:
  - `getDashboardDb()` → the dashboard's own project (`DASHBOARD_FIREBASE_*`),
    used for the secrets vault (read **and** write).
  - `getAppDb("FB_SIGNUP")` → a monitored app's project (`FB_SIGNUP_*`),
    used read‑only for metrics.

This is also why the secrets vault lives in a **separate dashboard project** and
never inside an app's project — it keeps the dashboard's data isolated from the
products it monitors.

---

## The app registry

[`lib/apps-config.ts`](../lib/apps-config.ts) is the single source of truth for
which apps exist and what to count. Each entry:

```ts
{
  id: "custom-signup-forms",   // used in routes and as the secrets appId
  name: "Custom Signup Forms",
  envPrefix: "FB_SIGNUP",       // → FB_SIGNUP_PROJECT_ID / _CLIENT_EMAIL / _PRIVATE_KEY
  installs: { label: "Installs", kind: "collection", path: "stores" },
  metrics: [ /* more MetricSpecs */ ],
}
```

### Metric specs: `collection` vs `collectionGroup`

The monitored apps share a data shape:

- `stores/{storeHash}` — one doc per install → the **install count**.
- `users/{userId}` — admin users.
- App‑specific data is either a **top‑level collection** (e.g. `settings` in
  weight‑based) or a **sub‑collection** under each store (e.g.
  `stores/{hash}/signupRequests`, `stores/{hash}/formVersions`).

A `MetricSpec` therefore declares its `kind`:

- `kind: "collection"` → counted with `db.collection(path).count()`.
- `kind: "collectionGroup"` → counted with `db.collectionGroup(path).count()`,
  which aggregates that sub‑collection across **all** stores.

[`actions/metrics.ts`](../actions/metrics.ts) picks the right query per spec, so
adding a metric never requires touching query code — just the registry.

---

## Authentication (NextAuth v5, split config)

Auth is split into two files on purpose:

- [`lib/auth.config.ts`](../lib/auth.config.ts) — **edge‑safe**. No Node‑only
  imports (no bcrypt, no firebase‑admin). Holds pages, session strategy, and the
  `authorized` callback. Imported by `middleware.ts`, which runs on the Edge
  runtime.
- [`lib/auth.ts`](../lib/auth.ts) — the **full** instance: spreads the edge
  config and adds the bcrypt‑backed Credentials provider. Imported only by the
  route handler (`app/api/auth/[...nextauth]`) and Server Actions (Node runtime).

If bcrypt/firebase‑admin were imported into the middleware bundle, the Edge build
would break — the split prevents that. The credentials check validates against a
single env‑stored admin (`ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`); sessions are JWT
with an 8‑hour max age. `types/next-auth.d.ts` augments the session type so
`session.user.id` is typed.

`middleware.ts` matches every route except `api`, `_next/*`, and `favicon.ico`;
the `authorized` callback redirects unauthenticated users to `/login` and
authenticated users away from `/login`.

---

## Secrets data flow

```
Browser (authenticated session)
   │  HTTPS
Server Action  ── actions/secrets.ts ("use server")
   │  Admin SDK (server‑to‑server)
Dashboard Firebase project
   /secrets   →  { appId, key, value: <AES ciphertext>, addedAt, addedBy }
```

- Values are encrypted with [`lib/crypto.ts`](../lib/crypto.ts) (`encrypt`)
  before they're written, using `ENCRYPTION_KEY`.
- They're decrypted **only** server‑side, inside the Server Action, and the
  plaintext is returned to the requesting authed session. It is never logged and
  never stored or sent in encrypted form to the browser.
- The UI masks values by default (`maskValue`) and reveals on demand client‑side.

See [SECURITY.md](SECURITY.md) for the full model.

---

## Directory map

```
app/
  layout.tsx                 Root layout (fonts, html/body)
  login/page.tsx             Public login (client form → authenticate action)
  (dashboard)/
    layout.tsx               Authed shell (Nav + container)
    page.tsx                 Overview — getAllAppMetrics()
    apps/[appId]/page.tsx    Per‑app detail — getAppMetric() + getRecentStores()
    secrets/page.tsx         Secrets vault — getSecretsByApp() per app
  api/auth/[...nextauth]/    NextAuth handlers (GET, POST)

actions/
  secrets.ts                 requireAuth + CRUD against the dashboard project
  metrics.ts                 per‑project counts (collection/collectionGroup)
  auth.ts                    authenticate() and logout() server actions

components/
  Nav.tsx                    Top nav + sign‑out (client)
  AppCard.tsx                One app on the overview
  StatGrid.tsx               Metric cards
  ActivityFeed.tsx           Store sample list
  SecretRow.tsx              Reveal / copy / delete a secret (client)
  AddSecretForm.tsx          Add a secret (client)

lib/
  firebase-admin.ts          Multi‑project Admin SDK init
  apps-config.ts             The app registry + MetricSpec types
  crypto.ts                  AES encrypt/decrypt + maskValue
  auth.config.ts             Edge‑safe NextAuth config
  auth.ts                    Full NextAuth instance
  accent.ts                  Static Tailwind accent‑class map per app color

types/next-auth.d.ts         Session/JWT type augmentation
middleware.ts                Route protection
firestore.rules              Dashboard‑project security rules
```

---

## Adding a new app

1. **Service account** — create a read‑only service account in the new app's
   Firebase project (see [SETUP.md](SETUP.md#create-a-service-account-per-project)).
2. **Env vars** — add `FB_<NAME>_PROJECT_ID`, `FB_<NAME>_CLIENT_EMAIL`,
   `FB_<NAME>_PRIVATE_KEY` to `.env.local` (and Vercel). Also add the same keys
   (without values) to `.env.example` so the next developer sees them.
3. **Registry** — add an entry to `APPS` in
   [`lib/apps-config.ts`](../lib/apps-config.ts): set `id`, `name`,
   `description`, `envPrefix: "FB_<NAME>"`, a `color`, the `installs` spec
   (usually `stores`), and any extra `metrics` (use `collectionGroup` for
   sub‑collections).

No other code changes are needed — pages, metrics, and the secrets vault all
iterate over `APPS`.

---

## Conventions

- **npm**, TypeScript **strict** (no `any` — use `unknown`), path alias `@/*`.
- **Server Components by default**; `"use client"` only for interactivity
  (`SecretRow`, `AddSecretForm`, `Nav`, login form).
- Server Actions return `{ success, error? }` and call `requireAuth()` first.
- Tailwind **v4** (CSS‑first; `@import "tailwindcss"` in `app/globals.css`).
  Dynamic color classes won't survive purge — accent classes are kept as full
  static strings in `lib/accent.ts`.
- `npm run lint` + `npm run build` must pass before pushing.
