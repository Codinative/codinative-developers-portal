import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the edge-safe config (no bcrypt/firebase-admin) for middleware. The
// `authorized` callback in authConfig handles redirects to /login.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
