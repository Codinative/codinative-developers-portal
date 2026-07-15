"use client";

import { useState, useTransition } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import { createTeamUser } from "@/actions/users";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

// Readable random password so the admin can share it with the teammate.
function suggestPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function AddTeamMemberForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "member">("member"); // least privilege by default
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(null);
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    startTransition(async () => {
      const res = await createTeamUser(email.trim(), name.trim(), password, role);
      if (res.success) {
        setDone(`Login created for ${email.trim()}. Share the email + password with them.`);
        setEmail("");
        setName("");
        setPassword("");
        setRole("member");
      } else {
        setError(res.error ?? "Failed to create login.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@codinative.com"
            className={inputCls}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className={inputCls}
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password <span className="font-normal text-gray-400">(min 8 chars)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set or generate a password"
            className={`${inputCls} font-mono`}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setPassword(suggestPassword())}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Generate
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "owner" | "member")}
          className={`${inputCls} sm:w-1/3`}
        >
          <option value="member">Member — no team management</option>
          <option value="owner">Owner — full access</option>
        </select>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      {done && <p className="text-sm text-emerald-600 dark:text-emerald-400">{done}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
      >
        <UserPlus className="h-4 w-4" />
        {isPending ? "Creating…" : "Create login"}
      </button>
    </form>
  );
}
