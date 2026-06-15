import Link from "next/link";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { ACCENTS } from "@/lib/accent";
import type { AppMetrics } from "@/actions/metrics";

export function AppCard({ app }: { app: AppMetrics }) {
  const accent = ACCENTS[app.color];

  return (
    <Link
      href={`/apps/${app.id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40 dark:hover:shadow-black/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{app.name}</h3>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500 dark:text-gray-600 dark:group-hover:text-indigo-400" />
      </div>

      <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {app.description}
      </p>

      <div className="mt-4 flex items-end justify-between">
        {app.status === "live" ? (
          <div>
            <div className="text-3xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {app.installs.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Installs
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
            <CircleAlert className="h-4 w-4" />
            <span>Metrics unavailable</span>
          </div>
        )}

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            app.status === "live"
              ? `${accent.chipBg} ${accent.chipText}`
              : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          }`}
        >
          {app.status === "live" ? "Live" : "Error"}
        </span>
      </div>
    </Link>
  );
}
