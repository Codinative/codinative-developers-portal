"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { resolveLogin } from "@/lib/users-store";
import { otpEnabled, issueLoginCode } from "@/lib/login-otp";

export type LoginStep1 = {
  ok: boolean;
  otpRequired?: boolean;
  expiresAt?: number; // epoch ms, for the countdown
  error?: string;
};

// Step 1: verify the password. If OTP is on, email a code and tell the client
// to show the code screen. If OTP is off, signal that it can sign in directly.
export async function requestLoginCode(
  email: string,
  password: string,
): Promise<LoginStep1> {
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  // Resolve against the owner admin or any team-member login.
  const account = await resolveLogin(email, password);
  if (!account) {
    return { ok: false, error: "Invalid email or password" };
  }

  if (!otpEnabled()) {
    return { ok: true, otpRequired: false };
  }

  try {
    const expiresAt = await issueLoginCode(account.email);
    return { ok: true, otpRequired: true, expiresAt };
  } catch {
    return {
      ok: false,
      error: "Couldn't send the verification code — please try again.",
    };
  }
}

// Step 2 (or the only step when OTP is off): mint the session. The credentials
// provider re-validates the password and, when OTP is on, the code.
export async function completeLogin(
  email: string,
  password: string,
  code?: string,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email,
      password,
      code: code ?? "",
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return code
        ? "Invalid or expired code"
        : "Invalid email or password";
    }
    throw error; // redirect on success
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
