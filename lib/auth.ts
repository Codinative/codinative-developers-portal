import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

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
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Validate against the single env-stored admin only.
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !adminHash) return null;
        if (email !== adminEmail) return null;

        const isValid = await bcrypt.compare(password, adminHash);
        if (!isValid) return null;

        return { id: "admin", email, name: "Admin" };
      },
    }),
  ],
});
