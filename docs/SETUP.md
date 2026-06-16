# Setup

How to get the dashboard running locally from a fresh clone. Budget ~10 minutes,
mostly spent in the Firebase console creating one service account.

> New to how the pieces fit together? Skim **[ARCHITECTURE.md](ARCHITECTURE.md)**
> first.

---

## 1. Prerequisites

- **Node.js 20+** and **npm** (this project uses npm, not pnpm/yarn).
- Access to the company's Firebase / Google Cloud console.
- `openssl` (preinstalled on macOS/Linux) for generating a secret.

```bash
npm install
```

---

## 2. The Firebase project you need

The dashboard stores **all** of its data (secrets, projects, QA, team logins,
admin login) in a **single Firebase project of its own**:

| Purpose | Project | Access the dashboard needs |
|---|---|---|
| Dashboard's own data | a dedicated **`codinative-dashboard`** project (create one) | read **and** write |

It's reached with a **service account**.

### Create the service account

1. Firebase Console → the project → ⚙️ **Project settings** → **Service accounts**.
2. **Generate new private key** → downloads a JSON file.
3. From that JSON you need three fields → they map to env vars:
   - `project_id` → `DASHBOARD_FIREBASE_PROJECT_ID`
   - `client_email` → `DASHBOARD_FIREBASE_CLIENT_EMAIL`
   - `private_key` → `DASHBOARD_FIREBASE_PRIVATE_KEY`

> The dashboard's service account needs read **and** write — it owns and manages
> all of the dashboard's collections.

---

## 3. Generate the local secrets

```bash
# 64‑char hex encryption key (for the secrets vault)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# NextAuth signing secret
openssl rand -base64 32

# bcrypt hash of the admin password (replace 'your-password')
node -e "require('bcryptjs').hash('your-password', 12).then(console.log)"
```

---

## 4. Fill in `.env.local`

`cp .env.example .env.local`, then set every variable below. **Never commit
`.env.local`** — it's gitignored.

### Environment variable reference

| Variable | Required | What it is / how to get it |
|---|:--:|---|
| `DASHBOARD_FIREBASE_PROJECT_ID` | ✅ | `project_id` from the dashboard project's service account |
| `DASHBOARD_FIREBASE_CLIENT_EMAIL` | ✅ | `client_email` from the same JSON |
| `DASHBOARD_FIREBASE_PRIVATE_KEY` | ✅ | `private_key` from the same JSON (see note below) |
| `ENCRYPTION_KEY` | ✅ | the 64‑char hex string from step 3 (min 32 chars) |
| `AUTH_SECRET` | ✅ | the `openssl rand -base64 32` value from step 3 |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` locally; the deployed URL in prod |
| `AUTH_TRUST_HOST` | ✅ | `true` |
| `ADMIN_EMAIL` | ✅ | the owner admin's login email (first‑run default) |
| `ADMIN_PASSWORD_HASH` | ✅ | the bcrypt hash from step 3 (first‑run default) |

> `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` are only the **first‑run default**. Once
> you change the login from **Settings**, the stored value takes over. Team
> logins are created entirely from Settings — no env vars.

#### Private‑key formatting

Service‑account private keys are multi‑line. In `.env.local`, wrap the value in
double quotes and keep the literal `\n` escapes — the code converts them back to
real newlines:

```env
DASHBOARD_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

---

## 5. Apply the Firestore rules (dashboard project)

In the dashboard project: Firebase Console → Firestore → **Rules** → paste the
contents of [`firestore.rules`](../firestore.rules) → **Publish**. This blocks
all client access to every dashboard collection; only the server (Admin SDK) can
touch them.

---

## 6. Run it

```bash
npm run dev      # http://localhost:3000
```

Expected first run:

1. Visiting `/` redirects you to `/login`.
2. Log in with `ADMIN_EMAIL` + the password you hashed.
3. The Overview shows links into Projects, QA and Secrets.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `ENCRYPTION_KEY must be at least 32 characters` | Key too short — regenerate with the step‑3 command |
| Login always fails | `ADMIN_EMAIL` mismatch, or `ADMIN_PASSWORD_HASH` isn't the bcrypt hash of the password you're typing |
| `Failed to parse private key` | Private key not wrapped in quotes / `\n` escapes mangled — re‑paste per step 4 |
| Redirect loop or session won't persist | `AUTH_SECRET` unset, or `AUTH_TRUST_HOST` not `true` |
| A page errors reading data | Wrong `DASHBOARD_FIREBASE_*` creds, or Firestore not enabled on the dashboard project |
