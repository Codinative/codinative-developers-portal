import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { getEffectiveAdmin } from "./admin-config";
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

        // Validate against the single admin — stored in Firestore if it has
        // been set from Settings, otherwise the env-var bootstrap default.
        const admin = await getEffectiveAdmin();
        if (!admin) return null;
        if (email.toLowerCase() !== admin.email.toLowerCase()) return null;

        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isValid) return null;

        // Second factor: when OTP is enabled, a valid, unexpired, single-use
        // code is required in addition to the password.
        if (otpEnabled()) {
          const okCode = code ? await verifyLoginCode(admin.email, code) : false;
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
            email: admin.email,
            ip,
            userAgent,
            when: new Date().toISOString(),
          });
        } catch {
          /* already handled inside sendLoginAlert */
        }

        return { id: "admin", email: admin.email, name: "Admin" };
      },
    }),
  ],
});
