import { Database } from "lucide-react";
import { getConnectedProjects } from "@/actions/projects";
import { getAccountInfo } from "@/actions/account";
import { ConnectFirebaseForm } from "@/components/ConnectFirebaseForm";
import { ConnectedProjectCard } from "@/components/ConnectedProjectCard";
import { AccountSettingsForm } from "@/components/AccountSettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [projects, account] = await Promise.all([
    getConnectedProjects(),
    getAccountInfo(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect Firebase projects and manage your login — no redeploy needed.
        </p>
      </div>

      {/* Connected Firebase projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-medium">
            <Database className="h-4 w-4 text-gray-500" />
            Connected Firebase projects
          </h2>
          <span className="text-sm text-gray-400">
            {projects.length} connected
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-400">
            No Firebase projects connected from the UI yet. Apps configured via
            environment variables still work — connect one below to manage it
            here instead.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <ConnectedProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        <div className="pt-2">
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            Connect a new project
          </h3>
          <ConnectFirebaseForm />
        </div>
      </section>

      {/* Admin login */}
      <section className="space-y-4">
        <h2 className="text-base font-medium">Login credentials</h2>
        <AccountSettingsForm
          currentEmail={account.email}
          source={account.source}
        />
      </section>
    </div>
  );
}
