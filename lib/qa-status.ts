// ----------------------------------------------------------------------------
// QA checklist status vocabulary + styling.
//
// Pure constants only — NO server imports — so this is safe to import from both
// Client Components (the item rows) and Server Actions. Tailwind v4 purges
// dynamic class names, so every status carries its full, static class strings.
// ----------------------------------------------------------------------------

export type QaStatus = "pending" | "pass" | "fail" | "partial" | "na";

/** Every status, in display order. */
export const QA_STATUSES: QaStatus[] = ["pass", "fail", "partial", "na", "pending"];

/** The statuses a reviewer can actively set from the segmented control. */
export const ACTION_STATUSES: QaStatus[] = ["pass", "fail", "partial", "na"];

export type StatusMeta = {
  label: string;
  short: string;
  /** Small chip used in summaries / section headers. */
  badge: string;
  /** Selected state of a segmented-control button. */
  selected: string;
  /** Status dot. */
  dot: string;
};

export const STATUS_META: Record<QaStatus, StatusMeta> = {
  pass: {
    label: "Pass",
    short: "Pass",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    selected: "border-emerald-600 bg-emerald-600 text-white",
    dot: "bg-emerald-500",
  },
  fail: {
    label: "Fail",
    short: "Fail",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    selected: "border-rose-600 bg-rose-600 text-white",
    dot: "bg-rose-500",
  },
  partial: {
    label: "Partial",
    short: "Partial",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    selected: "border-amber-500 bg-amber-500 text-white",
    dot: "bg-amber-500",
  },
  na: {
    label: "N/A",
    short: "N/A",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
    selected: "border-slate-500 bg-slate-500 text-white",
    dot: "bg-slate-400",
  },
  pending: {
    label: "Pending",
    short: "—",
    badge: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    selected: "border-gray-400 bg-gray-400 text-white",
    dot: "bg-gray-300 dark:bg-gray-600",
  },
};

export type StatusCounts = Record<QaStatus, number>;

export function emptyCounts(): StatusCounts {
  return { pass: 0, fail: 0, partial: 0, na: 0, pending: 0 };
}

export function normalizeStatus(value: unknown): QaStatus {
  return QA_STATUSES.includes(value as QaStatus) ? (value as QaStatus) : "pending";
}
