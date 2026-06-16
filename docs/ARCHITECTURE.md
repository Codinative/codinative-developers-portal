# Architecture

The mental model for the dashboard, the non‑obvious decisions, and where things
live. Read this before making structural changes.

---

## What the app does

1. **Overview** (`/`) — quick links into the workspace sections.
2. **Projects** (`/projects`, `/projects/[projectId]`) — a manual hub: create a
   project, then collect its related links and per‑project secrets in one place.
3. **QA** (`/qa`, `/qa/[checklistId]`) — checklists / app‑review runs, seeded
   from reusable templates.
4. **Secrets vault** (`/secrets`) — a general AES‑encrypted key/value store for
   API keys and tokens not tied to a specific project.
5. **Settings** (`/settings`) — change the owner login and manage team logins.
6. Everything except `/login` is behind authentication.

---

## One Firebase project

The dashboard stores **all** of its data in a single Firebase project of its
own — the secrets vault, projects, QA checklists, team logins and the admin
login. [`lib/firebase-admin.ts`](../lib/firebase-admin.ts) lazily initializes a
single named Admin app via `getDashboardDb()`, with credentials from
`DASHBOARD_FIREBASE_*` env vars.

Collections in that project:

| Collection | Holds |
|---|---|
| `secrets` | Encrypted key/value secrets (keyed by `appId` = project id, or `general`). |
| `projects` | Manual Projects hub entries + their links. |
| `qaChecklists` | QA / app‑review checklist runs. |
| `dashboardUsers` | Team member logins (bcrypt password hashes). |
| `appConfig` | Owner admin login (`appConfig/admin`). |
| `loginOtps` | Short‑lived hashed login OTP codes. |

All collections are locked to `if false` in
[`firestore.rules`](../firestore.rules) — the Admin SDK in Server Actions
bypasses the rules; browsers are blocked entirely.

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
would break — the split prevents that. The credentials check runs
`resolveLogin(email, password)` ([`lib/users-store.ts`](../lib/users-store.ts)),
which validates the **owner admin first** (stored `appConfig/admin`, falling back
to `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`), then **team members**
(`dashboardUsers`). Sessions are JWT. `types/next-auth.d.ts` augments the session
type so `session.user.id` is typed.

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

- `appId` scopes a secret: the **general vault** (`/secrets`) uses
  `GENERAL_SCOPE` (`"general"`); a project's detail page reuses the same vault
  keyed by the **project's id**.
- Values are encrypted with [`lib/crypto.ts`](../lib/crypto.ts) (`encrypt`)
  before they're written, using `ENCRYPTION_KEY`.
- They're decrypted **only** server‑side, inside the Server Action, and the
  plaintext is returned to the requesting authed session. It is never logged and
  never sent in encrypted form to the browser.
- The UI masks values by default (`maskValue`) and reveals on demand client‑side.

See [SECURITY.md](SECURITY.md) for the full model.

---

## Directory map

```
app/
  layout.tsx                 Root layout (fonts, html/body)
  login/page.tsx             Public login (client form → authenticate action)
  (dashboard)/
    layout.tsx               Authed shell (Sidebar + container)
    page.tsx                 Overview — section links
    projects/page.tsx        Projects hub list
    projects/[projectId]/    Project detail — links + secrets
    qa/page.tsx              QA checklist list
    qa/[checklistId]/        Checklist detail
    secrets/page.tsx         General secrets vault — getSecretsByApp("general")
    settings/page.tsx        Owner login + team logins
  api/auth/[...nextauth]/    NextAuth handlers (GET, POST)

actions/
  secrets.ts                 requireAuth + CRUD against the dashboard project
  project-hub.ts             Projects + links CRUD
  qa.ts                      Checklists CRUD
  users.ts                   Team-member CRUD
  account.ts                 Change owner login
  auth.ts                    authenticate() / logout() / login-OTP actions

components/
  Sidebar.tsx                Sidebar nav + sign‑out (client)
  SecretRow.tsx              Reveal / copy / delete a secret (client)
  AddSecretForm.tsx          Add a secret (client)
  projects/*                 Projects hub UI
  qa/*                       QA checklist UI
  AccountSettingsForm.tsx    Change owner login (client)
  AddTeamMemberForm.tsx      Add a team login (client)
  TeamMemberRow.tsx          Reset / delete a team login (client)

lib/
  firebase-admin.ts          Admin SDK init (getDashboardDb)
  crypto.ts                  AES encrypt/decrypt + maskValue
  auth.config.ts             Edge‑safe NextAuth config
  auth.ts                    Full NextAuth instance
  admin-config.ts            Owner admin store + env fallback
  users-store.ts             Team-member store + resolveLogin
  qa-status.ts / qa-templates.ts   QA status meta + checklist templates

types/next-auth.d.ts         Session/JWT type augmentation
middleware.ts                Route protection
firestore.rules              Dashboard‑project security rules
```

---

## Conventions

- **npm**, TypeScript **strict** (no `any` — use `unknown`), path alias `@/*`.
- **Server Components by default**; `"use client"` only for interactivity
  (`SecretRow`, `AddSecretForm`, `Sidebar`, forms, login).
- Server Actions return `{ success, error? }` and call `requireAuth()` first.
- Tailwind **v4** (CSS‑first; `@import "tailwindcss"` in `app/globals.css`).
  Dynamic color classes won't survive purge — keep status/accent classes as full
  static strings (e.g. `lib/qa-status.ts`).
- `npm run lint` + `npm run build` must pass before pushing.
