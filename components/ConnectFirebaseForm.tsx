"use client";

import { useState, useTransition } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { connectFirebaseProject } from "@/actions/projects";

const COLORS = ["blue", "green", "purple", "amber", "rose", "slate"] as const;

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";
const labelClass =
  "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";
const helpClass = "mt-1 text-xs text-gray-400 dark:text-gray-500";

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
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div>
        <label className={labelClass}>Display name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Custom Signup Forms"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Service account JSON</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={6}
          placeholder='Paste the full service-account key file, e.g. { "type": "service_account", "project_id": "…", "client_email": "…", "private_key": "-----BEGIN PRIVATE KEY-----\n…" }'
          className={`${inputClass} font-mono text-xs`}
          autoComplete="off"
          spellCheck={false}
        />
        <p className={helpClass}>
          Firebase Console → Project settings → Service accounts → Generate new
          private key. The private key is encrypted before it&apos;s stored.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ChevronDown
          className={`h-4 w-4 transition ${showAdvanced ? "rotate-180" : ""}`}
        />
        Advanced (color &amp; metrics)
      </button>

      {showAdvanced && (
        <div className="space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div>
            <label className={labelClass}>Accent color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={`${inputClass} capitalize sm:w-1/2`}
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Installs collection</label>
            <input
              type="text"
              value={installsPath}
              onChange={(e) => setInstallsPath(e.target.value)}
              placeholder="stores"
              className={`${inputClass} font-mono sm:w-1/2`}
            />
            <p className={helpClass}>
              Top-level collection counted as the headline number (one doc per
              install). Defaults to <code>stores</code>.
            </p>
          </div>
          <div>
            <label className={labelClass}>Extra metric collections</label>
            <input
              type="text"
              value={extraMetrics}
              onChange={(e) => setExtraMetrics(e.target.value)}
              placeholder="settings, group:signupRequests"
              className={`${inputClass} font-mono`}
            />
            <p className={helpClass}>
              Comma-separated. Prefix with <code>group:</code> to count a
              sub-collection across all stores. <code>users</code> is always
              counted.
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      {done && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Project connected.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {isPending ? "Connecting…" : "Connect Firebase project"}
      </button>
    </form>
  );
}
