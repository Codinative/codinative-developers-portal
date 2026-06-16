"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ClipboardCheck, Trash2 } from "lucide-react";
import { deleteChecklist, type QaChecklistSummary } from "@/actions/qa";
import { QA_STATUSES, STATUS_META } from "@/lib/qa-status";

export function ChecklistCard({ checklist }: { checklist: QaChecklistSummary }) {
  const [isDeleting, startDelete] = useTransition();
  const { id, name, appName, templateName, total, counts, updatedAt } = checklist;

  const reviewed = total - counts.pending;
  const pct = total === 0 ? 0 : Math.round((reviewed / total) * 100);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startDelete(async () => {
      await deleteChecklist(id);
    });
  }

  return (
    <Link
      href={`/qa/${id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <ClipboardCheck className="h-4 w-4" />
            </span>
            <h3 className="truncate font-medium text-gray-900 dark:text-gray-100">{name}</h3>
          </div>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {appName ? `${appName} · ` : ""}
            {templateName}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete checklist"
          className="shrink-0 rounded-md border border-gray-200 p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* progress */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{reviewed} of {total} reviewed</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* status counts */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {QA_STATUSES.filter((s) => counts[s] > 0).map((s) => (
          <span
            key={s}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_META[s].badge}`}
          >
            {STATUS_META[s].label} {counts[s]}
          </span>
        ))}
        {total === 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">No items yet</span>
        )}
      </div>

      {updatedAt && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Updated {new Date(updatedAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}
