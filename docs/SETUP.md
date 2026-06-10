# Setup

How to get the dashboard running locally from a fresh clone. Budget ~20 minutes,
mostly spent in the Firebase console creating service accounts.

> New to how the pieces fit together? Skim **[ARCHITECTURE.md](ARCHITECTURE.md)**
> first — in particular *why there are multiple Firebase projects*.

---

## 1. Prerequisites

- **Node.js 20+** and **npm** (this project uses npm, not pnpm/yarn).
- Access to the company's Firebase / Google Cloud console.
- `openssl` (preinstalled on macOS/Linux) for generating a secret.

```bash
npm install
```

---

## 2. Firebase projects you need

The dashboard talks to **several** Firebase projects (see ARCHITECTURE for the
why):

| Purpose | Project | Access the dashboard needs |
|---|---|---|
| Dashboard's own data (the `secrets` vault) | a dedicated **`codinative-dashboard`** project (create one) | read **and** write |
| `custom-signup-forms` metrics | `bc-signup-customisation-app` | **read‑only** |
| `weight-based-shipping-charge` metrics | `bc-weight-based-shipping` | **read‑only** |

Each one is reached with its own **service account**.

### Create a service account (per project)

1. Firebase Console → the project → ⚙️ **Project settings** → **Service accounts**.
2. **Generate new private key** → downloads a JSON file.
3. From that JSON you need three fields → they map to env vars:
   - `project_id` → `*_PROJECT_ID`
   - `client_email` → `*_CLIENT_EMAIL`
   - `private_key` → `*_PRIVATE_KEY`

> **Least privilege:** for the *monitored* apps, the dashboard only reads. In
> Google Cloud IAM, grant that service account **Cloud Datastore Viewer**
> (read‑only) rather than the default editor role. The dashboard project's own
> service account needs read **and** write (it manages the secrets vault).

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
| `DASHBOARD_FIREBASE_PROJECT_ID` | ✅ | `project_id` from the **dashboard** project's service account |
| `DASHBOARD_FIREBASE_CLIENT_EMAIL` | ✅ | `client_email` from the same JSON |
| `DASHBOARD_FIREBASE_PRIVATE_KEY` | ✅ | `private_key` from the same JSON (see note below) |
| `FB_SIGNUP_PROJECT_ID` | ✅ | `bc-signup-customisation-app` |
| `FB_SIGNUP_CLIENT_EMAIL` | ✅ | service‑account email for that project |
| `FB_SIGNUP_PRIVATE_KEY` | ✅ | service‑account private key for that project |
| `FB_WEIGHT_PROJECT_ID` | ✅ | `bc-weight-based-shipping` |
| `FB_WEIGHT_CLIENT_EMAIL` | ✅ | service‑account email for that project |
| `FB_WEIGHT_PRIVATE_KEY` | ✅ | service‑account private key for that project |
| `ENCRYPTION_KEY` | ✅ | the 64‑char hex string from step 3 (min 32 chars) |
| `AUTH_SECRET` | ✅ | the `openssl rand -base64 32` value from step 3 |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` locally; the deployed URL in prod |
| `AUTH_TRUST_HOST` | ✅ | `true` |
| `ADMIN_EMAIL` | ✅ | the single admin's login email |
| `ADMIN_PASSWORD_HASH` | ✅ | the bcrypt hash from step 3 |

> The env‑var **prefix** for each app (`FB_SIGNUP`, `FB_WEIGHT`) is defined by
> `envPrefix` in [`lib/apps-config.ts`](../lib/apps-config.ts). Adding an app =
> a new prefix + a new set of these three vars. See
> [ARCHITECTURE.md → Adding a new app](ARCHITECTURE.md#adding-a-new-app).

#### Private‑key formatting

Service‑account private keys are multi‑line. In `.env.local`, wrap the value in
double quotes and keep the literal `\n` escapes — the code converts them back to
real newlines:

```env
DASHBOARD_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

---

## 5. Apply the Firestore rules (dashboard project)

In the **dashboard** project: Firebase Console → Firestore → **Rules** → paste
the contents of [`firestore.rules`](../firestore.rules) → **Publish**. This
blocks all client access to `secrets`; only the server (Admin SDK) can touch it.

You do **not** need to change rules on the monitored projects — the dashboard
reads them via service accounts, which bypass security rules.

---

## 6. Run it

```bash
npm run dev      # http://localhost:3000
```

Expected first run:

1. Visiting `/` redirects you to `/login`.
2. Log in with `ADMIN_EMAIL` + the password you hashed.
3. The overview shows install/user counts per app. An app whose service‑account
   env vars are missing or wrong shows an **"Error"** badge instead of crashing
   the page — fix that app's `*_PRIVATE_KEY`/`*_CLIENT_EMAIL` and refresh.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| App card shows **"Metrics unavailable / Error"** | Wrong or missing `FB_*` service‑account vars, or the SA lacks Firestore read access |
| `ENCRYPTION_KEY must be at least 32 characters` | Key too short — regenerate with the step‑3 command |
| Login always fails | `ADMIN_EMAIL` mismatch, or `ADMIN_PASSWORD_HASH` isn't the bcrypt hash of the password you're typing |
| `Failed to parse private key` | Private key not wrapped in quotes / `\n` escapes mangled — re‑paste per step 4 |
| Redirect loop or session won't persist | `AUTH_SECRET` unset, or `AUTH_TRUST_HOST` not `true` |
