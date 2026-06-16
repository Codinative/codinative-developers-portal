"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createChecklist } from "@/actions/qa";
import { QA_TEMPLATES } from "@/lib/qa-templates";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

export function NewChecklistForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [appName, setAppName] = useState("");
  const [templateId, setTemplateId] = useState(QA_TEMPLATES[0]?.id ?? "blank");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const template = QA_TEMPLATES.find((t) => t.id === templateId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("A checklist name is required");
      return;
    }
    startTransition(async () => {
      const res = await createChecklist({
        name: name.trim(),
        appName: appName.trim(),
        templateId,
      });
      if (res.success && res.id) {
        router.push(`/qa/${res.id}`);
      } else {
        setError(res.error ?? "Failed to create checklist");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">New checklist</h2>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
        Start a QA run from a template, then track each criterion.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Checklist name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Custom Signup Forms — v1.4 submission"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            App / project <span className="text-gray-400">(optional)</span>
          </span>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g. Custom Signup Forms"
            className={inputCls}
          />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
          Template
        </span>
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className={inputCls}
        >
          {QA_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {t.items.length ? ` (${t.items.length} criteria)` : ""}
            </option>
          ))}
        </select>
        {template && (
          <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500">
            {template.description}
          </span>
        )}
      </label>

      {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Creating…" : "Create checklist"}
        </button>
      </div>
    </form>
  );
}
