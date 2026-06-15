"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updateAdminCredentials } from "@/actions/account";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

export function AccountSettingsForm({
  currentEmail,
  source,
}: {
  currentEmail: string;
  source: "store" | "env" | "none";
}) {
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (!email.trim() || !currentPassword) {
      setError("Email and current password are required.");
      return;
    }
    startTransition(async () => {
      const res = await updateAdminCredentials(
        email.trim(),
        currentPassword,
        newPassword,
      );
      if (res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setDone(true);
      } else {
        setError(res.error ?? "Failed to update credentials.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {source === "env"
          ? "Login currently comes from environment variables. Saving here stores it in the database and takes over."
          : source === "store"
            ? "Login is stored in the database."
            : "No admin configured yet."}
      </p>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Login email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClass} sm:w-2/3`}
          autoComplete="username"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            New password{" "}
            <span className="font-normal text-gray-400 dark:text-gray-500">(optional)</span>
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            className={inputClass}
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      {done && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Credentials updated.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Saving…" : "Save credentials"}
      </button>
    </form>
  );
}
