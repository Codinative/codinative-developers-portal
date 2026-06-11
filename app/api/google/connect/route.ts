import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { googleConfigured, buildAuthUrl } from "@/lib/google-oauth";

// Kick off the Google OAuth consent flow. Admin-only.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!googleConfigured()) {
    return NextResponse.redirect(
      new URL("/settings?google=not-configured", req.url),
    );
  }

  const state = randomUUID();
  const redirectUri = new URL("/api/google/callback", req.url).toString();
  const res = NextResponse.redirect(buildAuthUrl(redirectUri, state));
  res.cookies.set("g_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
