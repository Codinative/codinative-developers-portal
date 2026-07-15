import type { DefaultSession } from "next-auth";

// Augment the session/JWT so `session.user.id`/`role` and `token.id`/`role`
// are typed under TypeScript strict mode.
declare module "next-auth" {
  interface User {
    role?: "owner" | "member";
  }

  interface Session {
    user: {
      id: string;
      role: "owner" | "member";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "owner" | "member";
  }
}
