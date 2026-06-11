"use client";

import { useState, useTransition } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { connectFirebaseProject } from "@/actions/projects";

const COLORS = ["blue", "green", "purple", "amber", "rose", "slate"] as const;

export function ConnectFirebaseForm() {
  const [name, setName] = useState("");
  const [json, setJson] = useState("");
  const [color, setColor] = useState<string>("slate");
  const [installsPath, setInstallsPath] = useState("stores");
  const [extraMetrics, setExtraMetrics] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (!name.trim() || !json.trim()) {
      setError("Display name and service-account JSON are both required.");
      return;
    }
    startTransition(async () => {
      const res = await connectFirebaseProject({
        name: name.trim(),
        serviceAccountJson: json,
        color,
        installsPath: installsPath.trim() || "stores",
        extraMetrics: extraMetrics.trim() || undefined,
      });
      if (res.success) {
        setName("");
        setJson("");
        setExtraMetrics("");
        setColor("slate");
        setInstallsPath("stores");
        setShowAdvanced(false);
        setDone(true);
      } else {
        setError(res.error ?? "Failed to connect the project.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Display name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Custom Signup Forms"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Service account JSON
        </label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={6}
          placeholder='Paste the full service-account key file, e.g. { "type": "service_account", "project_id": "…", "client_email": "…", "private_key": "-----BEGIN PRIVATE KEY-----\n…" }'
          className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs focus:border-gray-400 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-gray-400">
          Firebase Console → Project settings → Service accounts → Generate new
          private key. The private key is encrypted before it&apos;s stored.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronDown
          className={`h-4 w-4 transition ${showAdvanced ? "rotate-180" : ""}`}
        />
        Advanced (color &amp; metrics)
      </button>

      {showAdvanced && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Accent color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm capitalize focus:border-gray-400 focus:outline-none"
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Installs collection
            </label>
            <input
              type="text"
              value={installsPath}
              onChange={(e) => setInstallsPath(e.target.value)}
              placeholder="stores"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-gray-400 focus:outline-none sm:w-1/2"
            />
            <p className="mt-1 text-xs text-gray-400">
              Top-level collection counted as the headline number (one doc per
              install). Defaults to <code>stores</code>.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Extra metric collections
            </label>
            <input
              type="text"
              value={extraMetrics}
              onChange={(e) => setExtraMetrics(e.target.value)}
              placeholder="settings, group:signupRequests"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-gray-400 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Comma-separated. Prefix with <code>group:</code> to count a
              sub-collection across all stores. <code>users</code> is always
              counted.
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {done && (
        <p className="text-sm text-emerald-600">Project connected.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {isPending ? "Connecting…" : "Connect Firebase project"}
      </button>
    </form>
  );
}
