"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updateAdminCredentials } from "@/actions/account";

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
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
    >
      <p className="text-xs text-gray-400">
        {source === "env"
          ? "Login currently comes from environment variables. Saving here stores it in the database and takes over."
          : source === "store"
            ? "Login is stored in the database."
            : "No admin configured yet."}
      </p>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Login email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none sm:w-2/3"
          autoComplete="username"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            New password{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {done && <p className="text-sm text-emerald-600">Credentials updated.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Saving…" : "Save credentials"}
      </button>
    </form>
  );
}
