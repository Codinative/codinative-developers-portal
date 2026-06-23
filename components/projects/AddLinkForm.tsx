"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addLink } from "@/actions/project-hub";
import { LinkTypeSelect } from "./LinkTypeSelect";
import { getLinkType, type LinkTypeId } from "./link-types";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

export function AddLinkForm({ projectId }: { projectId: string }) {
  const [type, setType] = useState<LinkTypeId>("github");
  const [label, setLabel] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeType = getLinkType(type);

  function handleTypeChange(next: LinkTypeId) {
    // If the label is still the auto-filled name of the current type (or empty),
    // keep it in sync with the new type so picking "Shopify" labels it "Shopify".
    setLabel((prev) =>
      prev.trim() === "" || prev === getLinkType(type).label
        ? getLinkType(next).label
        : prev,
    );
    setType(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!label.trim() || !url.trim()) {
      setError("Label and URL are required");
      return;
    }
    startTransition(async () => {
      const res = await addLink(projectId, label.trim(), url.trim(), type);
      if (res.success) {
        setUrl("");
        // Keep the chosen type & label so adding several of the same kind is quick.
      } else {
        setError(res.error ?? "Failed to add link");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Add a link</h3>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
        Pick what it is, give it a name, and paste the URL.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(11rem,1fr)_minmax(9rem,1fr)_2fr]">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Type</span>
          <LinkTypeSelect value={type} onChange={handleTypeChange} disabled={isPending} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Label</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={`e.g. ${activeType.label} repo`}
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">URL</span>
          <input
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={activeType.placeholder}
            className={inputCls}
          />
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
          {isPending ? "Adding…" : "Add link"}
        </button>
      </div>
    </form>
  );
}
