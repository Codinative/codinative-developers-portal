# Security

This dashboard holds production API keys and tokens, so the security model is
deliberately conservative. Read this before changing anything in `lib/crypto.ts`,
`lib/auth*.ts`, `actions/secrets.ts`, or `firestore.rules`.

---

## Model at a glance

| Layer | Control |
|---|---|
| Network | Authenticated session over HTTPS only |
| Access | Every route except `/login` requires a session (middleware) |
| Secrets at rest | AES‑encrypted in Firestore; ciphertext only |
| Secrets in transit | Decrypted server‑side; plaintext returned only to the authed session that asked |
| Database | Admin SDK (server‑to‑server); clients blocked by Firestore rules |
| Key material | `ENCRYPTION_KEY` lives only in env vars — never in code, Firestore, or the browser |

---

## Encryption

- [`lib/crypto.ts`](../lib/crypto.ts) uses crypto‑js AES with `ENCRYPTION_KEY`.
  CryptoJS derives the key with a salted KDF, so each ciphertext is salted and
  self‑describing.
- `ENCRYPTION_KEY` must be **≥ 32 chars** (the helper throws otherwise);
  generate 64 hex chars — see [SETUP.md](SETUP.md#3-generate-the-local-secrets).
- Values are masked in the UI by default (`maskValue`) and only revealed on
  explicit user action, client‑side.
- **Decrypted values are never logged.** Error handlers log the error object,
  not the plaintext.

> Future hardening (optional): swap crypto‑js AES‑CBC for Node `crypto`
> AES‑256‑GCM for authenticated encryption. Not required for an internal tool,
> but noted in `lib/crypto.ts`.

---

## Authentication

- **Single admin**, validated against `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`
  (a **bcrypt** hash — never store plaintext).
- Sessions are **JWT**, `maxAge` 8 hours → auto‑logout.
- Auth is split so the bcrypt/Node code never enters the Edge middleware bundle
  (see [ARCHITECTURE.md → Authentication](ARCHITECTURE.md#authentication-nextauth-v5-split-config)).
- `AUTH_SECRET` signs the session; rotating it invalidates all sessions.

---

## Login alerts (optional)

Every **successful** login can email an alert (account, time, IP, device) to
`LOGIN_ALERT_EMAIL` via SMTP — see [`lib/notify.ts`](../lib/notify.ts), wired
into the credentials provider in [`lib/auth.ts`](../lib/auth.ts).

- Toggle with `LOGIN_ALERT_ENABLED` (default on; set `false` to disable without
  removing SMTP creds). Sends only when SMTP is configured.
- Fires on success only (not failed attempts); a delivery failure is logged but
  **never** blocks login. SMTP calls are time-capped so a flaky server can't
  hang the login response.
- For Gmail, use an **App Password** (requires 2-Step Verification), not the
  account password. `SMTP_PASS` is a secret — env only.

---

## Firestore rules

- The **dashboard** project applies [`firestore.rules`](../firestore.rules):
  `secrets` (and everything else) is `allow read, write: if false`. The Admin
  SDK bypasses rules; no browser/client can read the vault.
- **Monitored** projects keep their own existing rules. The dashboard reads them
  via service accounts, which bypass rules — so grant those service accounts the
  minimum (**Cloud Datastore Viewer**, read‑only).

---

## Pre‑deploy checklist

- [ ] `.env.local` is gitignored and never committed
- [ ] `ENCRYPTION_KEY` is ≥ 32 chars, randomly generated
- [ ] `ADMIN_PASSWORD_HASH` is a bcrypt hash (not plaintext)
- [ ] Dashboard project's Firestore rules block all client access (`if false`)
- [ ] Middleware protects every route except `/login`
- [ ] Session expires after 8 hours
- [ ] No `console.log` prints a decrypted secret value
- [ ] Secrets are only read/written inside `"use server"` actions
- [ ] Every Server Action calls `requireAuth()` as its first line
- [ ] Delete actions are guarded by a `confirm()` dialog
- [ ] All env vars are set in Vercel (not just `.env.local`)
- [ ] Monitored‑app service accounts are **read‑only**; the dashboard SA has only what it needs

---

## Key rotation

Rotate `ENCRYPTION_KEY` periodically (target: every 90 days). Because old
ciphertext can't be decrypted with a new key, rotation requires re‑encrypting
the vault — see the procedure in
[DEPLOYMENT.md → Rotating the encryption key](DEPLOYMENT.md#rotating-the-encryption-key).

## Reporting / incident

If a key or token is exposed: rotate the affected credential at its source
(BigCommerce / Firebase), then rotate `ENCRYPTION_KEY` and re‑encrypt the vault.
