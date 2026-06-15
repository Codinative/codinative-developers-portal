import { getAllAppMetrics } from "@/actions/metrics";
import { AppCard } from "@/components/AppCard";
import { StatGrid } from "@/components/StatGrid";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const apps = await getAllAppMetrics();
  const live = apps.filter((a) => a.status === "live");
  const totalInstalls = live.reduce((sum, a) => sum + a.installs, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Live metrics across every BigCommerce app, pulled from each app&apos;s Firestore project.
        </p>
      </div>

      <StatGrid
        stats={[
          { label: "Apps tracked", value: apps.length },
          { label: "Live", value: live.length },
          { label: "Total installs", value: totalInstalls },
        ]}
      />

      <div>
        <h2 className="mb-3 text-base font-medium">Apps</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
