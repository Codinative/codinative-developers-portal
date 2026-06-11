import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { getEffectiveAdmin } from "./admin-config";

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

        // Validate against the single admin — stored in Firestore if it has
        // been set from Settings, otherwise the env-var bootstrap default.
        const admin = await getEffectiveAdmin();
        if (!admin) return null;
        if (email.toLowerCase() !== admin.email.toLowerCase()) return null;

        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isValid) return null;

        return { id: "admin", email: admin.email, name: "Admin" };
      },
    }),
  ],
});
