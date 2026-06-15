"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addSecret } from "@/actions/secrets";

export function AddSecretForm({ appId }: { appId: string }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!key.trim() || !value.trim()) {
      setError("Both key and value are required");
      return;
    }
    startTransition(async () => {
      const res = await addSecret(appId, key.trim(), value.trim());
      if (res.success) {
        setKey("");
        setValue("");
      } else {
        setError(res.error ?? "Failed to save secret");
      }
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key (e.g. ACCESS_TOKEN)"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:w-1/3 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
        />
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value (encrypted on save)"
          autoComplete="off"
          className="w-full flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Saving…" : "Add"}
        </button>
      </form>
      {error && <p className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
