# Codinative Apps Dashboard

Internal team workspace for Codinative. It provides a **Projects** hub (related
links + per‑project secrets), **QA** checklists / app‑review runs, an
**AES‑encrypted secrets vault**, and **team logins**, all behind a single admin
login.

> 🔒 Internal tool — not public, not indexed. Every route except `/login` is
> gated by authentication.

## Tech stack

Next.js 15 (App Router) · NextAuth v5 (credentials) · Firebase Admin SDK ·
crypto‑js (AES) · bcryptjs · Tailwind CSS v4 · Headless UI + Lucide ·
TypeScript (strict). Package manager: **npm**.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill it in — see docs/SETUP.md
npm run dev                  # http://localhost:3000
```

The app needs a Firebase service account for its own project plus a few
generated secrets before it's fully functional. The complete, copy‑pasteable
walkthrough is in **[docs/SETUP.md](docs/SETUP.md)** — start there.

## 📚 Documentation

| Doc | Read it when you want to… |
|---|---|
| **[docs/SETUP.md](docs/SETUP.md)** | Get it running locally — env var reference, creating the dashboard's Firebase project & service account, generating secrets |
| **[docs/SETTINGS.md](docs/SETTINGS.md)** | Configure it at runtime — change the admin login and create team logins from the in‑app **Settings** page (no redeploy) |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Understand how it's built — the auth split, data flow, directory map |
| **[docs/SECURITY.md](docs/SECURITY.md)** | Review the security model and the pre‑deploy checklist |
| **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Deploy to Vercel and rotate the encryption key |

## Repository layout

```
app/                  Next.js App Router
  (dashboard)/        Authenticated routes: overview (/), /projects, /qa, /secrets, /settings
  login/              Public login page
  api/auth/           NextAuth route handler
actions/              Server Actions — projects, qa, secrets, users, auth
components/           UI components (Sidebar, SecretRow, projects/*, qa/*, …)
lib/                  firebase-admin, crypto, auth(.config), qa/users stores
types/                TypeScript module augmentations
middleware.ts         Route protection (Edge runtime)
firestore.rules       Rules for the dashboard's OWN Firebase project
docs/                 The documentation linked above
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server (Turbopack) on `:3000` |
| `npm run build` | Production build + full TypeScript typecheck |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Definition of done for a change

`npm run lint` and `npm run build` both pass with zero errors before you push.
