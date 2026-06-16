"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addLink } from "@/actions/project-hub";

const inputCls =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

export function AddLinkForm({ projectId }: { projectId: string }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!label.trim() || !url.trim()) {
      setError("Label and URL are required");
      return;
    }
    startTransition(async () => {
      const res = await addLink(projectId, label.trim(), url.trim());
      if (res.success) {
        setLabel("");
        setUrl("");
      } else {
        setError(res.error ?? "Failed to add link");
      }
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. GitHub repo)"
          className={`${inputCls} sm:w-1/3`}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (e.g. github.com/Codinative/…)"
          className={`${inputCls} flex-1`}
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding…" : "Add"}
        </button>
      </form>
      {error && <p className="mt-1.5 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
