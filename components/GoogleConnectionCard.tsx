"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Check,
  CircleAlert,
  Unplug,
  CircleCheck,
  Database,
} from "lucide-react";
import {
  addDiscoveredProject,
  disconnectGoogleAccount,
  type GoogleStatus,
} from "@/actions/google";

export function GoogleConnectionCard({ status }: { status: GoogleStatus }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  function handleAdd(projectId: string, displayName: string) {
    setError(null);
    setAdding(projectId);
    startTransition(async () => {
      const res = await addDiscoveredProject(projectId, displayName);
      if (!res.success) setError(res.error ?? "Failed to add the project.");
      setAdding(null);
    });
  }

  function handleDisconnect() {
    if (!confirm("Disconnect the Google account? Projects added from it will stop updating."))
      return;
    setError(null);
    startTransition(async () => {
      await disconnectGoogleAccount();
    });
  }

  // 1. OAuth not configured at the env level.
  if (!status.configured) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          To auto-discover Firebase projects, set{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
            GOOGLE_CLIENT_ID
          </code>{" "}
          and{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
            GOOGLE_CLIENT_SECRET
          </code>{" "}
          (see{" "}
          <span className="font-mono text-xs">docs/SETTINGS.md</span>), then
          redeploy.
        </p>
      </div>
    );
  }

  // 2. Configured but not connected.
  if (!status.connected) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          Connect the Google account that owns your Firebase projects to
          discover and add them without pasting service-account keys.
        </p>
        <a
          href="/api/google/connect"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <GoogleGlyph />
          Connect Google account
        </a>
      </div>
    );
  }

  // 3. Connected — show account + discovered projects.
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <CircleCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-gray-500 dark:text-gray-400">Connected as</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {status.email || "Google account"}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Unplug className="h-4 w-4" />
          Disconnect
        </button>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {status.error ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{status.error}</span>
        </div>
      ) : status.projects.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No Firebase projects found on this account.
        </p>
      ) : (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Discovered projects ({status.projects.length})
          </p>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {status.projects.map((p) => (
              <li
                key={p.projectId}
                className="flex items-center justify-between gap-3 px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {p.displayName}
                  </div>
                  <div className="flex items-center gap-1 truncate font-mono text-xs text-gray-400 dark:text-gray-500">
                    <Database className="h-3 w-3" />
                    {p.projectId}
                  </div>
                </div>
                {p.added ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <Check className="h-3.5 w-3.5" /> Added
                  </span>
                ) : (
                  <button
                    onClick={() => handleAdd(p.projectId, p.displayName)}
                    disabled={isPending}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {adding === p.projectId ? "Adding…" : "Add"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M21.35 11.1H12v2.92h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.66-5.85-5.94S8.78 6.54 12 6.54c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.93 14.55 3 12 3 6.99 3 2.93 7.06 2.93 12.08S6.99 21.16 12 21.16c5.78 0 9.6-4.06 9.6-9.78 0-.66-.07-1.16-.25-1.28Z"
      />
    </svg>
  );
}
