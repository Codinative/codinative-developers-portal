# In-app configuration (Settings)

The dashboard can be configured at runtime from the **Settings** page — no
redeploy or env-var edit required. This covers:

1. **Auto-discovering Firebase projects with Google** (Phase 2).
2. **Connecting a Firebase project manually** via service-account JSON (Phase 1).
3. **Changing the admin login** (email + password).

Everything configured here is stored in the dashboard's **own** Firestore
project, with service-account private keys and Google refresh tokens
**AES-encrypted at rest** (same `ENCRYPTION_KEY` as the secrets vault). The
config collections (`firebaseProjects`, `appConfig`) are locked to `if false` in
[`firestore.rules`](../firestore.rules) — only the server touches them.

There are two ways a project's Firestore is read:

| Connection | How it reads | Stored |
|---|---|---|
| **Service account** (paste JSON / env) | firebase-admin (Admin SDK) | encrypted private key |
| **Google** (OAuth) | Firestore REST API with the connected account's token | no key — uses the refresh token |

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

## Auto-discover with Google (Phase 2)

Connect the Google account that **owns** your Firebase projects and the
dashboard lists them automatically — click **Add** on any project to start
monitoring it. No service-account JSON, no per-project key. Reads go through the
Firestore REST API using the connected account's OAuth token; the project's docs
are counted with server-side aggregation queries.

### One-time Google Cloud setup

You need an OAuth client. In [Google Cloud Console](https://console.cloud.google.com/):

1. Pick (or create) a project to host the OAuth client — it doesn't have to be
   one of the Firebase projects.
2. **APIs & Services → OAuth consent screen** → configure it (User type
   *Internal* if all admins are in your Workspace, else *External* + add
   yourself as a test user). No sensitive-scope verification is needed for
   internal use.
3. Enable the **Firebase Management API** and the **Cloud Firestore API** on that
   project (APIs & Services → Library).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID** →
   type **Web application**. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/google/callback` (local)
   - `https://<your-deployed-url>/api/google/callback` (prod)
5. Copy the **Client ID** and **Client secret** into env:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```
   Set these in Vercel too, then redeploy.

The dashboard requests these scopes (read-only):
`openid`, `email`, `https://www.googleapis.com/auth/cloud-platform.read-only`.

### Connecting & using it

1. **Settings → Auto-discover with Google → Connect Google account.** You're
   sent to Google's consent screen; approve, and you're returned to Settings.
2. The connected account's email and its **discovered projects** appear. Click
   **Add** on any project — its credentials are verified with a live read, then
   it shows up on the Overview, gets an `/apps/<slug>` page, and a secrets group.
3. **Disconnect** removes the stored Google token. Projects already added stop
   updating until you reconnect (they read through that token).

> **Tokens:** only the long-lived **refresh token** is stored (encrypted in
> `appConfig/google`). Short-lived access tokens are fetched on demand and cached
> in memory for their hour-long lifetime. The token never reaches the browser.

> **Read failures:** if a discovered project can't be read, it usually means
> Firestore isn't enabled on it, or the consent didn't include the right scopes
> — disconnect and reconnect to re-consent.

---

## Connecting a Firebase project (manual)

Use this when you'd rather not connect Google, or for a project owned by a
different account.

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
| Encrypted project store + effective-apps merge + counters | [`lib/projects-store.ts`](../lib/projects-store.ts) |
| Init a project's Admin app from stored creds | [`lib/firebase-admin.ts`](../lib/firebase-admin.ts) (`getDbFromCreds`) |
| Connect / list / remove projects (server actions) | [`actions/projects.ts`](../actions/projects.ts) |
| Admin credentials store + env fallback | [`lib/admin-config.ts`](../lib/admin-config.ts) |
| Change-login server action | [`actions/account.ts`](../actions/account.ts) |
| Google OAuth flow + token store + project discovery | [`lib/google-oauth.ts`](../lib/google-oauth.ts) |
| Firestore reads for Google projects (REST) | [`lib/firestore-rest.ts`](../lib/firestore-rest.ts) |
| OAuth connect / callback routes | [`app/api/google/connect`](<../app/api/google/connect/route.ts>), [`callback`](<../app/api/google/callback/route.ts>) |
| Google status / add / disconnect (server actions) | [`actions/google.ts`](../actions/google.ts) |
| Settings UI | [`app/(dashboard)/settings/page.tsx`](<../app/(dashboard)/settings/page.tsx>) + `components/GoogleConnectionCard`, `ConnectFirebaseForm`, `ConnectedProjectCard`, `AccountSettingsForm` |
