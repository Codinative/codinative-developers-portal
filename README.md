# Codinative Apps Dashboard

Internal dashboard for Codinative's BigCommerce apps. It pulls **live metrics**
from each app's Firebase Firestore project and provides an **AES‑encrypted
secrets vault**, all behind a single admin login.

> 🔒 Internal tool — not public, not indexed. Every route except `/login` is
> gated by authentication.

## Tech stack

Next.js 15 (App Router) · NextAuth v5 (credentials) · Firebase Admin SDK
(multi‑project) · crypto‑js (AES) · bcryptjs · Tailwind CSS v4 · Headless UI +
Lucide · TypeScript (strict). Package manager: **npm**.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill it in — see docs/SETUP.md
npm run dev                  # http://localhost:3000
```

The app needs Firebase service accounts and a few generated secrets before it's
fully functional. The complete, copy‑pasteable walkthrough is in
**[docs/SETUP.md](docs/SETUP.md)** — start there.

## 📚 Documentation

| Doc | Read it when you want to… |
|---|---|
| **[docs/SETUP.md](docs/SETUP.md)** | Get it running locally — env var reference, creating Firebase projects & service accounts, generating secrets |
| **[docs/SETTINGS.md](docs/SETTINGS.md)** | Configure it at runtime — connect Firebase projects and change the admin login from the in‑app **Settings** page, no redeploy |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Understand how it's built — multi‑project Firebase, the app registry, the auth split, data flow, directory map, and how to add a new app |
| **[docs/SECURITY.md](docs/SECURITY.md)** | Review the security model and the pre‑deploy checklist |
| **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Deploy to Vercel and rotate the encryption key |

## Repository layout

```
app/                  Next.js App Router
  (dashboard)/        Authenticated routes: overview (/), /apps/[appId], /secrets, /settings
  login/              Public login page
  api/auth/           NextAuth route handler
actions/              Server Actions — secrets, metrics, auth
components/           UI components (AppCard, StatGrid, SecretRow, …)
lib/                  firebase-admin, apps-config, crypto, auth(.config), accent
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
