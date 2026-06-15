import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CircleAlert, KeyRound } from "lucide-react";
import { getAppMetric, getRecentStores } from "@/actions/metrics";
import { StatGrid } from "@/components/StatGrid";
import { ActivityFeed } from "@/components/ActivityFeed";

export const dynamic = "force-dynamic";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const [metric, stores] = await Promise.all([
    getAppMetric(appId),
    getRecentStores(appId),
  ]);
  if (!metric) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" /> Overview
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{metric.name}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
          </div>
          <Link
            href="/secrets"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <KeyRound className="h-4 w-4" /> Secrets
          </Link>
        </div>
      </div>

      {metric.status === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{metric.error}</span>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-base font-medium">Metrics</h2>
          <StatGrid
            stats={[
              { label: metric.installsLabel, value: metric.installs },
              ...metric.metrics.map((m) => ({ label: m.label, value: m.count })),
            ]}
          />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-medium">Stores</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">sample, not chronological</span>
        </div>
        <ActivityFeed items={stores} />
      </section>
    </div>
  );
}
