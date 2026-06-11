import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectGoogleFromCode } from "@/lib/google-oauth";

// OAuth redirect target. Verifies the state cookie, exchanges the code for
// tokens, and stores the (encrypted) refresh token. Admin-only.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("g_oauth_state")?.value;

  const settings = (status: string) =>
    NextResponse.redirect(new URL(`/settings?google=${status}`, req.url));

  if (url.searchParams.get("error")) return settings("denied");
  if (!code || !state || !cookieState || state !== cookieState) {
    return settings("error");
  }

  try {
    const redirectUri = new URL("/api/google/callback", req.url).toString();
    await connectGoogleFromCode(code, redirectUri);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return settings("error");
  }

  const res = settings("connected");
  res.cookies.delete("g_oauth_state");
  return res;
}
