"use client";

import { useState, useTransition } from "react";
import { Plus, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { addSecret } from "@/actions/secrets";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

export function AddSecretForm({ appId }: { appId: string }) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);
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
        setRevealed(false);
      } else {
        setError(res.error ?? "Failed to save secret");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Add a secret</h3>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
        Encrypted on save — the value is never stored or logged in plain text.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(10rem,1fr)_2fr]">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Key</span>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ACCESS_TOKEN"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Value</span>
          <div className="relative">
            <input
              type={revealed ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste the value…"
              autoComplete="new-password"
              spellCheck={false}
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? "Hide value" : "Show value"}
              className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Saving…" : "Add secret"}
        </button>
      </div>
    </form>
  );
}
