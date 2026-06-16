import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { resolveLogin } from "./users-store";
import { sendLoginAlert } from "./notify";
import { otpEnabled, verifyLoginCode } from "./login-otp";

// Full NextAuth instance — includes the bcrypt-backed Credentials provider, so
// this module is imported only by the route handler and Server Actions (Node
// runtime), never by the Edge middleware.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials, request) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const code = credentials?.code as string | undefined;
        if (!email || !password) return null;

        // Validate against the owner admin (Firestore appConfig/admin or env
        // fallback) OR any team member login stored in Firestore.
        const account = await resolveLogin(email, password);
        if (!account) return null;

        // Second factor: when OTP is enabled, a valid, unexpired, single-use
        // code is required in addition to the password.
        if (otpEnabled()) {
          const okCode = code ? await verifyLoginCode(account.email, code) : false;
          if (!okCode) return null;
        }

        // Fire a login-alert email (no-op unless SMTP is configured; never
        // throws — a mail failure must not block a valid login).
        try {
          const headers = request?.headers;
          const ip =
            headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headers?.get("x-real-ip") ||
            "unknown";
          const userAgent = headers?.get("user-agent") || "unknown";
          await sendLoginAlert({
            email: account.email,
            ip,
            userAgent,
            when: new Date().toISOString(),
          });
        } catch {
          /* already handled inside sendLoginAlert */
        }

        return { id: account.id, email: account.email, name: account.name };
      },
    }),
  ],
});
