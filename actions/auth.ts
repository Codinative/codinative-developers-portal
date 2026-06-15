"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { getEffectiveAdmin } from "@/lib/admin-config";
import { otpEnabled, issueLoginCode } from "@/lib/login-otp";

export type LoginStep1 = {
  ok: boolean;
  otpRequired?: boolean;
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

  const admin = await getEffectiveAdmin();
  if (!admin) {
    return { ok: false, error: "No admin is configured." };
  }
  if (
    email.trim().toLowerCase() !== admin.email.toLowerCase() ||
    !(await bcrypt.compare(password, admin.passwordHash))
  ) {
    return { ok: false, error: "Invalid email or password" };
  }

  if (!otpEnabled()) {
    return { ok: true, otpRequired: false };
  }

  try {
    await issueLoginCode(admin.email);
  } catch {
    return {
      ok: false,
      error: "Couldn't send the verification code — please try again.",
    };
  }
  return { ok: true, otpRequired: true };
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
      redirectTo: "/",
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
