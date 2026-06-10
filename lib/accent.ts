import type { AppConfig } from "@/lib/apps-config";

// Full, static class strings per accent so Tailwind v4 detects them at build
// time (dynamic `bg-${color}-500` would be purged).
export const ACCENTS: Record<
  AppConfig["color"],
  { dot: string; chipBg: string; chipText: string; ring: string }
> = {
  blue: { dot: "bg-blue-500", chipBg: "bg-blue-50", chipText: "text-blue-700", ring: "ring-blue-200" },
  green: { dot: "bg-emerald-500", chipBg: "bg-emerald-50", chipText: "text-emerald-700", ring: "ring-emerald-200" },
  purple: { dot: "bg-violet-500", chipBg: "bg-violet-50", chipText: "text-violet-700", ring: "ring-violet-200" },
  amber: { dot: "bg-amber-500", chipBg: "bg-amber-50", chipText: "text-amber-700", ring: "ring-amber-200" },
  rose: { dot: "bg-rose-500", chipBg: "bg-rose-50", chipText: "text-rose-700", ring: "ring-rose-200" },
  slate: { dot: "bg-slate-500", chipBg: "bg-slate-100", chipText: "text-slate-700", ring: "ring-slate-200" },
};
