import type { DefaultSession } from "next-auth";

// Augment the session/JWT so `session.user.id` and `token.id` are typed under
// TypeScript strict mode.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
