# In-app configuration (Settings)

The dashboard can be configured at runtime from the **Settings** page — no
redeploy or env-var edit required. This covers two things:

1. **Connecting Firebase projects** (which power the metrics).
2. **Changing the admin login** (email + password).

Everything configured here is stored in the dashboard's **own** Firestore
project, with service-account private keys **AES-encrypted at rest** (same
`ENCRYPTION_KEY` as the secrets vault). The config collections
(`firebaseProjects`, `appConfig`) are locked to `if false` in
[`firestore.rules`](../firestore.rules) — only the server's Admin SDK touches
them.

> Phase 1 connects projects by **pasting a service-account JSON**. "Sign in with
> Google" OAuth auto-discovery is planned as Phase 2 and will layer on top of
> this same store.

---

## What still must live in env vars (bootstrap)

A few values can't move into the UI, because they're what *unlocks* the store:

| Variable | Why it must stay in env |
|---|---|
| `DASHBOARD_FIREBASE_PROJECT_ID` / `_CLIENT_EMAIL` / `_PRIVATE_KEY` | You need a database before you can store config *in* a database. |
| `ENCRYPTION_KEY` | Can't store the key inside the thing it encrypts. |
| `AUTH_SECRET` | Signs the session cookie. |

That's **5 variables, set once.** See [SETUP.md](SETUP.md) and
[DEPLOYMENT.md](DEPLOYMENT.md). Everything else is optional and overridable from
Settings.

---

## Connecting a Firebase project

1. In the source project's Firebase Console → **Project settings → Service
   accounts → Generate new private key** → downloads a JSON file. (Grant it
   read-only **Cloud Datastore Viewer** in Google Cloud IAM — see
   [SECURITY.md](SECURITY.md).)
2. In the dashboard, go to **Settings → Connect a new project**.
3. **Display name** — becomes the app's name and its slug (`id`) used in routes
   (`/apps/<slug>`) and as the secrets `appId`.
4. **Service account JSON** — paste the whole file. `project_id`, `client_email`
   and `private_key` are read from it; the private key is encrypted on save.
5. **Advanced** (optional):
   - **Accent color** — UI color for the app's card/chips.
   - **Installs collection** — the top-level collection counted as the headline
     number (default `stores`).
   - **Extra metric collections** — comma-separated. Prefix an entry with
     `group:` to count a **sub-collection across all stores** via a
     collectionGroup query (e.g. `group:signupRequests`). `users` is always
     counted.
6. **Connect.** The credentials are verified with a live read before they're
   stored; if the read fails (Firestore disabled, no access, wrong key) the
   connection is rejected with an explanation.

Once connected, the project appears on the **Overview**, gets its own
**`/apps/<slug>`** detail page, and shows up as a group on the **Secrets & env
variables** page — all without a redeploy.

### How it merges with env-based apps

`getEffectiveApps()` ([`lib/projects-store.ts`](../lib/projects-store.ts))
combines the static env registry in
[`lib/apps-config.ts`](../lib/apps-config.ts) with everything connected through
the UI. **Stored projects win on id collisions**, so connecting a project with
the same slug as an env app takes over cleanly. With nothing connected, the app
runs purely off env vars exactly as before.

### Removing a project

**Settings → the project card → trash icon.** This deletes the stored
credentials only. Secrets saved under that app's `appId` are **not** touched.

> **Credential updates & warm instances:** firebase-admin caches the initialized
> app by project id. If you remove and re-add a project with a *new* key, the new
> key takes effect on the next cold start of the serverless function.

---

## Changing the admin login

**Settings → Login credentials.** Enter the new email, your **current password**
(required to authorize the change), and optionally a new password (≥ 8 chars;
leave blank to change only the email).

- Credentials are stored in `appConfig/admin` as `{ email, passwordHash }`, the
  hash produced with **bcrypt** server-side — plaintext is never stored.
- Login checks the **stored** admin first, falling back to the env
  `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` only if nothing is stored. So the env
  pair is just the first-run default; once you save here, it takes over.
- Changing the password does **not** invalidate the current session (sessions
  expire on their own 8-hour `maxAge`). Rotating `AUTH_SECRET` is what forcibly
  logs everyone out.

---

## Where this lives in the code

| Concern | File |
|---|---|
| Encrypted project store + effective-apps merge | [`lib/projects-store.ts`](../lib/projects-store.ts) |
| Init a project's Admin app from stored creds | [`lib/firebase-admin.ts`](../lib/firebase-admin.ts) (`getDbFromCreds`) |
| Connect / list / remove projects (server actions) | [`actions/projects.ts`](../actions/projects.ts) |
| Admin credentials store + env fallback | [`lib/admin-config.ts`](../lib/admin-config.ts) |
| Change-login server action | [`actions/account.ts`](../actions/account.ts) |
| Settings UI | [`app/(dashboard)/settings/page.tsx`](<../app/(dashboard)/settings/page.tsx>) + `components/ConnectFirebaseForm`, `ConnectedProjectCard`, `AccountSettingsForm` |
