"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addItem } from "@/actions/qa";

const inputCls =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500";

export function AddQaItemForm({
  checklistId,
  sections,
}: {
  checklistId: string;
  sections: string[];
}) {
  const [section, setSection] = useState(sections[0] ?? "General");
  const [criterion, setCriterion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!criterion.trim()) {
      setError("Enter a checkpoint");
      return;
    }
    startTransition(async () => {
      const res = await addItem(checklistId, section.trim() || "General", criterion.trim());
      if (res.success) {
        setCriterion("");
      } else {
        setError(res.error ?? "Failed to add checkpoint");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        list="qa-sections"
        value={section}
        onChange={(e) => setSection(e.target.value)}
        placeholder="Section"
        className={`${inputCls} sm:w-52`}
      />
      <datalist id="qa-sections">
        {sections.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <input
        type="text"
        value={criterion}
        onChange={(e) => setCriterion(e.target.value)}
        placeholder="Add your own checkpoint…"
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
      {error && <p className="text-sm text-rose-600 dark:text-rose-400 sm:ml-2">{error}</p>}
    </form>
  );
}
