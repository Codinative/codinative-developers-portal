# In-app configuration (Settings)

The dashboard can be configured at runtime from the **Settings** page — no
redeploy or env-var edit required. This covers:

1. **Changing the admin (owner) login** — email + password.
2. **Creating team logins** — a separate email/password for each teammate.

Everything configured here is stored in the dashboard's **own** Firestore
project, with password hashes produced by **bcrypt** server-side. The config
collections (`appConfig`, `dashboardUsers`) are locked to `if false` in
[`firestore.rules`](../firestore.rules) — only the server touches them.

---

## What must live in env vars (bootstrap)

A few values can't move into the UI, because they're what *unlocks* the store:

| Variable | Why it must stay in env |
|---|---|
| `DASHBOARD_FIREBASE_PROJECT_ID` / `_CLIENT_EMAIL` / `_PRIVATE_KEY` | You need a database before you can store config *in* a database. |
| `ENCRYPTION_KEY` | Can't store the key inside the thing it encrypts. |
| `AUTH_SECRET` | Signs the session cookie. |

That's **5 variables, set once.** See [SETUP.md](SETUP.md) and
[DEPLOYMENT.md](DEPLOYMENT.md). The admin login is optional in env (first-run
default) and overridable from Settings.

---

## Changing the admin (owner) login

**Settings → Your login (owner).** Enter the new email, your **current password**
(required to authorize the change), and optionally a new password (≥ 8 chars;
leave blank to change only the email).

- Credentials are stored in `appConfig/admin` as `{ email, passwordHash }`, the
  hash produced with **bcrypt** server-side — plaintext is never stored.
- Login checks the **stored** admin first, falling back to the env
  `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` only if nothing is stored. So the env
  pair is just the first-run default; once you save here, it takes over.
- Changing the password does **not** invalidate the current session (sessions
  expire on their own `maxAge`). Rotating `AUTH_SECRET` is what forcibly logs
  everyone out.

---

## Team logins

**Settings → Team logins.** Create a login for each teammate so they can sign in
with their own email and password — no redeploy needed.

- Each member is stored in the `dashboardUsers` collection as
  `{ email, name, passwordHash }`, the hash produced with bcrypt (cost 12).
- Login resolves the **owner admin first**, then falls back to team members, so a
  teammate signs in with the exact same login screen.
- Set a password when you create the member and share it with them; you can
  **reset** it or **delete** the member at any time from the same page.

---

## Where this lives in the code

| Concern | File |
|---|---|
| Admin credentials store + env fallback | [`lib/admin-config.ts`](../lib/admin-config.ts) |
| Change-login server action | [`actions/account.ts`](../actions/account.ts) |
| Team-member store (`dashboardUsers`) + `resolveLogin` | [`lib/users-store.ts`](../lib/users-store.ts) |
| Team-member server actions | [`actions/users.ts`](../actions/users.ts) |
| Settings UI | [`app/(dashboard)/settings/page.tsx`](<../app/(dashboard)/settings/page.tsx>) + `components/AccountSettingsForm`, `AddTeamMemberForm`, `TeamMemberRow` |
