import type { AppConfig } from "@/lib/apps-config";

// Full, static class strings per accent so Tailwind v4 detects them at build
// time (dynamic `bg-${color}-500` would be purged). Each includes dark variants.
export const ACCENTS: Record<
  AppConfig["color"],
  { dot: string; chipBg: string; chipText: string; ring: string }
> = {
  blue: {
    dot: "bg-blue-500",
    chipBg: "bg-blue-50 dark:bg-blue-500/15",
    chipText: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-200 dark:ring-blue-500/30",
  },
  green: {
    dot: "bg-emerald-500",
    chipBg: "bg-emerald-50 dark:bg-emerald-500/15",
    chipText: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-500/30",
  },
  purple: {
    dot: "bg-violet-500",
    chipBg: "bg-violet-50 dark:bg-violet-500/15",
    chipText: "text-violet-700 dark:text-violet-300",
    ring: "ring-violet-200 dark:ring-violet-500/30",
  },
  amber: {
    dot: "bg-amber-500",
    chipBg: "bg-amber-50 dark:bg-amber-500/15",
    chipText: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-200 dark:ring-amber-500/30",
  },
  rose: {
    dot: "bg-rose-500",
    chipBg: "bg-rose-50 dark:bg-rose-500/15",
    chipText: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-200 dark:ring-rose-500/30",
  },
  slate: {
    dot: "bg-slate-500",
    chipBg: "bg-slate-100 dark:bg-slate-500/15",
    chipText: "text-slate-700 dark:text-slate-300",
    ring: "ring-slate-200 dark:ring-slate-500/30",
  },
};
