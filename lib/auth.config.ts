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
      const { pathname } = nextUrl;

      // Public Developer Portal routes — viewable without a session. The
      // projects listing (/what-we-built) is intentionally NOT public: it exposes
      // internal company projects and is restricted to signed-in team members.
      const isPublicRoute =
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/docs" ||
        pathname.startsWith("/docs/");

      // Send already-authenticated users away from the login screen.
      if (pathname === "/login") {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      if (isPublicRoute) return true;

      // Everything else (the admin workspace) requires a session; returning
      // false makes NextAuth redirect to the configured signIn page (/login).
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
