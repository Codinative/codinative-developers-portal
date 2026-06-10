import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CircleAlert, KeyRound } from "lucide-react";
import { getAppMetric, getRecentStores } from "@/actions/metrics";
import { getAppById } from "@/lib/apps-config";
import { StatGrid } from "@/components/StatGrid";
import { ActivityFeed } from "@/components/ActivityFeed";

export const dynamic = "force-dynamic";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  const config = getAppById(appId);
  if (!config) notFound();

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
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" /> Overview
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{config.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{config.description}</p>
          </div>
          <Link
            href="/secrets"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <KeyRound className="h-4 w-4" /> Secrets
          </Link>
        </div>
      </div>

      {metric.status === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{metric.error}</span>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-base font-medium">Metrics</h2>
          <StatGrid
            stats={[
              { label: config.installs.label, value: metric.installs },
              ...metric.metrics.map((m) => ({ label: m.label, value: m.count })),
            ]}
          />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-medium">Stores</h2>
          <span className="text-xs text-gray-400">sample, not chronological</span>
        </div>
        <ActivityFeed items={stores} />
      </section>
    </div>
  );
}
