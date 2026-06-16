# Deployment

The dashboard deploys to **Vercel**. It runs entirely server‑side (Server
Components + Server Actions + Admin SDK), so there's no separate backend.

---

## Deploy to Vercel

1. **Push** the repo to GitHub (confirm `.env.local` is *not* committed —
   `git status` should never list it).
2. In Vercel, **Import** the GitHub repository.
3. Framework preset: **Next.js** (auto‑detected). Build command `next build`,
   install `npm install` — defaults are correct.
4. Add **Environment Variables** (Project → Settings → Environment Variables) —
   every variable from your `.env.local`. See the full list in
   [SETUP.md → Environment variable reference](SETUP.md#environment-variable-reference).
   Two prod‑specific values:
   - `NEXTAUTH_URL` → your deployed URL (e.g. `https://dashboard.codinative.com`).
   - `AUTH_TRUST_HOST` → `true`.
5. **Deploy.**

### Pasting private keys into Vercel

For each `*_PRIVATE_KEY`, paste the **full** key including the
`-----BEGIN PRIVATE KEY-----` / `-----END PRIVATE KEY-----` lines. Vercel handles
multi‑line values; the app also normalizes `\n` escapes, so either real newlines
or escaped `\n` work.

### Post‑deploy smoke test

1. Open the deployed URL → you should be redirected to `/login`.
2. Log in with `ADMIN_EMAIL` → the overview loads with live counts.
3. Open `/secrets`, add a throwaway secret, reveal/copy/delete it.
4. In the dashboard project's Firestore console, confirm the stored `value` is
   **ciphertext**, not plaintext.

---

## Firestore rules

Apply [`firestore.rules`](../firestore.rules) to the **dashboard** project once
(Firebase Console → Firestore → Rules → Publish). This is a one‑time console
step, independent of Vercel deploys.

---

## Rotating the encryption key

`ENCRYPTION_KEY` should be rotated periodically (target: every 90 days). Old
ciphertext cannot be read with a new key, so you must re‑encrypt the vault. There
is no automated script yet — the procedure is:

1. **Generate** a new key:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
2. **Re‑encrypt** every secret. With the dashboard project's service account,
   read each doc in `secrets`, `decrypt(value)` using the **old** key, then
   `encrypt(...)` using the **new** key and write it back. Do this in a one‑off
   script (or a temporary admin action) — keep both keys available for the
   duration and never log decrypted values.
3. **Swap** `ENCRYPTION_KEY` in Vercel (and any `.env.local`) to the new value
   and redeploy.
4. **Verify** by revealing a secret in the UI, then discard the old key.

> Tip: run step 2 against a copy/export first if you want a dry run. Rotation
> touches every secret, so do it during low traffic.

---

## Other notes

- **Rollback:** Vercel keeps previous deployments; promote an earlier one if a
  release misbehaves. Env‑var changes apply on the next deploy.
- **Edge‑runtime build warnings** about `jose` (`CompressionStream`) are benign;
  they come from NextAuth's dependency and don't affect the middleware.
