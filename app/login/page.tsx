"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import {
  ShieldCheck,
  CircleAlert,
  ArrowLeft,
  MailCheck,
  Clock,
} from "lucide-react";
import { requestLoginCode, completeLogin } from "@/actions/auth";

export default function LoginPage() {
  const [step, setStep] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Guard so auto-submit fires once per code value.
  const submittedFor = useRef<string>("");

  // Tick the countdown once per second while on the code step.
  useEffect(() => {
    if (step !== "code") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [step]);

  const remaining = expiresAt ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : 0;
  const expired = step === "code" && expiresAt !== null && remaining === 0;
  const mmss = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

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
        setCode("");
        submittedFor.current = "";
        setExpiresAt(res.expiresAt ?? Date.now() + 120_000);
        setNow(Date.now());
        setStep("code");
        setNotice(`We emailed an 8-digit code to ${email}.`);
      } else {
        const err = await completeLogin(email, password);
        if (err) setError(err);
      }
    });
  }

  function verify(value: string) {
    if (isPending || value.length !== 8 || expired) return;
    if (submittedFor.current === value) return; // don't double-fire
    submittedFor.current = value;
    setError(null);
    startTransition(async () => {
      const err = await completeLogin(email, password, value);
      if (err) {
        setError(err);
        submittedFor.current = ""; // allow retry of same digits after a failure
      }
    });
  }

  // Normalize any input/paste to digits, cap at 8, and auto-submit when full.
  function handleCode(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    setCode(digits);
    if (digits.length === 8) verify(digits);
  }

  function resend() {
    setError(null);
    setNotice(null);
    setCode("");
    submittedFor.current = "";
    startTransition(async () => {
      const res = await requestLoginCode(email, password);
      if (!res.ok) {
        setError(res.error ?? "Couldn't resend the code");
        return;
      }
      setExpiresAt(res.expiresAt ?? Date.now() + 120_000);
      setNow(Date.now());
      setNotice(`New code sent to ${email}.`);
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
            onSubmit={(e) => {
              e.preventDefault();
              verify(code);
            }}
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
                required
                autoFocus
                value={code}
                onChange={(e) => handleCode(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  handleCode(e.clipboardData.getData("text"));
                }}
                placeholder="8-digit code"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-center font-mono text-lg tracking-[0.4em] focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              {expired ? (
                <span className="text-rose-600">Code expired — resend a new one.</span>
              ) : (
                <span className="text-gray-500">
                  Code expires in <span className="font-medium tabular-nums">{mmss}</span>
                </span>
              )}
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-rose-600">
                <CircleAlert className="h-4 w-4" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || code.length !== 8 || expired}
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
                  setExpiresAt(null);
                  submittedFor.current = "";
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
