import type { NextAuthConfig } from "next-auth";

// ----------------------------------------------------------------------------
// Edge-safe NextAuth config. This file MUST NOT import Node-only modules
// (bcryptjs, firebase-admin, …) because it is loaded by the middleware, which
// runs on the Edge runtime. The Credentials provider — which needs bcrypt — is
// added in lib/auth.ts, used only by the route handler and Server Actions.
// ----------------------------------------------------------------------------

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours — auto-logout
  },
  providers: [], // real providers live in lib/auth.ts
  callbacks: {
    // Runs in middleware for every matched route — gate access here.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/login";

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true; // allow unauthenticated users to see /login
      }

      // Any other matched route requires a session; returning false makes
      // NextAuth redirect to the configured signIn page.
      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
