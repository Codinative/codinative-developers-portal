# Codinative Dashboard

Internal dashboard for Codinative's BigCommerce apps: live Firestore metrics per
app + an AES-encrypted secrets vault, behind a single admin login.

## Stack

Next.js 15 (App Router) · NextAuth v5 (credentials) · Firebase Admin SDK
(multi-project) · crypto-js (AES) · bcryptjs · Tailwind v4 · Headless UI + Lucide.

## Architecture notes

- **Each monitored app is its own Firebase project.** `lib/firebase-admin.ts`
  initializes one named Admin app per project; credentials are resolved by env
  prefix (`FB_SIGNUP_*`, `FB_WEIGHT_*`, …). The registry lives in
  `lib/apps-config.ts`.
- **The dashboard stores its own data** (the `secrets` collection) in a
  dedicated Firebase project via `DASHBOARD_FIREBASE_*`.
- **Auth is split** (`lib/auth.config.ts` edge-safe for middleware,
  `lib/auth.ts` with the bcrypt Credentials provider for the route handler and
  Server Actions) so Node-only deps stay out of the Edge middleware bundle.
- **Secrets never reach the browser encrypted.** They're decrypted only inside
  `actions/secrets.ts` (`"use server"`) and sent in plaintext to the authed
  session that asked for them; nothing is logged.

## Setup

1. `npm install`
2. `cp .env.example .env.local` and fill in:
   - A service account for the dashboard's own Firebase project (`DASHBOARD_FIREBASE_*`).
   - A **read-only** service account per monitored project (`FB_SIGNUP_*`, `FB_WEIGHT_*`).
   - `ENCRYPTION_KEY` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` — `node -e "require('bcryptjs').hash('pw',12).then(console.log)"`
3. Apply `firestore.rules` to the dashboard project (Firebase Console → Firestore → Rules).
4. `npm run dev` → http://localhost:3000

## Adding an app

Add an entry to `APPS` in `lib/apps-config.ts` with a fresh `envPrefix`, then add
the matching `*_PROJECT_ID` / `*_CLIENT_EMAIL` / `*_PRIVATE_KEY` env vars.

## Deploy (Vercel)

Add every `.env.local` var as a Vercel Environment Variable (paste full
multi-line `*_PRIVATE_KEY` values), set `AUTH_TRUST_HOST=true` and `NEXTAUTH_URL`
to the deployed URL, then deploy.
