export type Stat = { label: string; value: number | string };

export function StatGrid({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-6 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
        No metrics available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
        >
          <div className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
          </div>
          <div className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
