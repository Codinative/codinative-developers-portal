"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  setItemStatus,
  setItemReference,
  deleteItem,
  type QaItem,
} from "@/actions/qa";
import { ACTION_STATUSES, STATUS_META, type QaStatus } from "@/lib/qa-status";

export function QaItemRow({
  checklistId,
  item,
}: {
  checklistId: string;
  item: QaItem;
}) {
  const [status, setStatus] = useState<QaStatus>(item.status);
  const [reference, setReference] = useState(item.reference);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  function choose(next: QaStatus) {
    // Toggling the active status clears it back to pending.
    const value: QaStatus = status === next ? "pending" : next;
    setStatus(value);
    startTransition(async () => {
      await setItemStatus(checklistId, item.id, value);
    });
  }

  function saveReference() {
    if (reference === item.reference) return;
    startTransition(async () => {
      await setItemReference(checklistId, item.id, reference);
    });
  }

  function handleDelete() {
    if (!confirm("Delete this checkpoint?")) return;
    startDelete(async () => {
      await deleteItem(checklistId, item.id);
    });
  }

  return (
    <div
      className={`flex flex-col gap-3 px-4 py-3 transition sm:flex-row sm:items-start sm:gap-4 ${
        isDeleting ? "opacity-40" : ""
      }`}
    >
      {/* status dot + criterion */}
      <div className="flex min-w-0 flex-1 items-start gap-2.5">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_META[status].dot}`}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm text-gray-800 dark:text-gray-200">{item.criterion}</p>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            onBlur={saveReference}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            placeholder="Add a note or reference…"
            className="mt-1.5 w-full max-w-md rounded-md border border-transparent bg-transparent px-0 py-0.5 text-xs text-gray-500 placeholder-gray-400 transition focus:border-gray-200 focus:px-2 focus:text-gray-700 focus:outline-none dark:text-gray-400 dark:placeholder-gray-600 dark:focus:border-gray-700 dark:focus:text-gray-200"
          />
        </div>
      </div>

      {/* segmented status control */}
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          {ACTION_STATUSES.map((s, idx) => {
            const active = status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => choose(s)}
                disabled={isPending}
                className={`px-2.5 py-1 text-xs font-medium transition disabled:opacity-60 ${
                  idx > 0 ? "border-l border-gray-200 dark:border-gray-700" : ""
                } ${
                  active
                    ? STATUS_META[s].selected
                    : "bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {STATUS_META[s].short}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete checkpoint"
          className="rounded-md border border-gray-200 p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
