import { Store } from "lucide-react";
import type { StoreActivity } from "@/actions/metrics";

export function ActivityFeed({ items }: { items: StoreActivity[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-6 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
        No store activity to show
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
      {items.map((item) => (
        <li
          key={item.storeHash}
          className="flex items-center justify-between px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
        >
          <div className="flex items-center gap-3">
            <Store className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
              {item.storeHash}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {item.subscriptionStatus && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {item.subscriptionStatus}
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                item.uninstalled
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              }`}
            >
              {item.uninstalled ? "Uninstalled" : "Active"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
