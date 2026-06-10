import { Store } from "lucide-react";
import type { StoreActivity } from "@/actions/metrics";

export function ActivityFeed({ items }: { items: StoreActivity[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        No store activity to show
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white">
      {items.map((item) => (
        <li key={item.storeHash} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Store className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-sm">{item.storeHash}</span>
          </div>
          <div className="flex items-center gap-2">
            {item.subscriptionStatus && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {item.subscriptionStatus}
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                item.uninstalled
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
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
