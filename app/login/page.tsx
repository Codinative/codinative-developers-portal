"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, CircleAlert, ArrowLeft, MailCheck } from "lucide-react";
import { requestLoginCode, completeLogin } from "@/actions/auth";

export default function LoginPage() {
  const [step, setStep] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await requestLoginCode(email, password);
      if (!res.ok) {
        setError(res.error ?? "Sign in failed");
        return;
      }
      if (res.otpRequired) {
        setStep("code");
        setNotice(`We emailed an 8-digit code to ${email}. It expires in 2 minutes.`);
      } else {
        // OTP off — sign in directly (server action redirects on success).
        const err = await completeLogin(email, password);
        if (err) setError(err);
      }
    });
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const err = await completeLogin(email, password, code.trim());
      if (err) setError(err);
    });
  }

  function resend() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await requestLoginCode(email, password);
      if (!res.ok) setError(res.error ?? "Couldn't resend the code");
      else setNotice(`New code sent to ${email}.`);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-semibold">Codinative Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === "password" ? "Sign in to continue" : "Two-step verification"}
          </p>
        </div>

        {step === "password" ? (
          <form
            onSubmit={submitPassword}
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-6"
          >
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-rose-600">
                <CircleAlert className="h-4 w-4" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={submitCode}
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-6"
          >
            {notice && (
              <p className="flex items-start gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
                {notice}
              </p>
            )}

            <div>
              <label htmlFor="code" className="mb-1 block text-sm font-medium text-gray-700">
                Verification code
              </label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d*"
                maxLength={8}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="8-digit code"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-center font-mono text-lg tracking-[0.4em] focus:border-gray-400 focus:outline-none"
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-rose-600">
                <CircleAlert className="h-4 w-4" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || code.length < 6}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Verifying…" : "Verify & sign in"}
            </button>

            <div className="flex items-center justify-between pt-1 text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("password");
                  setCode("");
                  setError(null);
                  setNotice(null);
                }}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={resend}
                disabled={isPending}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
