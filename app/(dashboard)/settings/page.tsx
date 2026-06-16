import { Database, Sparkles, CircleCheck, CircleAlert, Users } from "lucide-react";
import { getConnectedProjects } from "@/actions/projects";
import { getAccountInfo } from "@/actions/account";
import { getTeamUsers } from "@/actions/users";
import { getGoogleStatus } from "@/actions/google";
import { ConnectFirebaseForm } from "@/components/ConnectFirebaseForm";
import { ConnectedProjectCard } from "@/components/ConnectedProjectCard";
import { AccountSettingsForm } from "@/components/AccountSettingsForm";
import { AddTeamMemberForm } from "@/components/AddTeamMemberForm";
import { TeamMemberRow } from "@/components/TeamMemberRow";
import { GoogleConnectionCard } from "@/components/GoogleConnectionCard";

export const dynamic = "force-dynamic";

const FLASH: Record<string, { ok: boolean; text: string }> = {
  connected: { ok: true, text: "Google account connected." },
  denied: { ok: false, text: "Google connection was cancelled." },
  error: { ok: false, text: "Google connection failed — please try again." },
  "not-configured": {
    ok: false,
    text: "Google OAuth isn't configured (set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).",
  },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  const { google } = await searchParams;
  const flash = google ? FLASH[google] : undefined;

  const [projects, account, team, googleStatus] = await Promise.all([
    getConnectedProjects(),
    getAccountInfo(),
    getTeamUsers(),
    getGoogleStatus(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect Firebase projects and manage your login — no redeploy needed.
        </p>
      </div>

      {flash && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            flash.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
          }`}
        >
          {flash.ok ? (
            <CircleCheck className="h-4 w-4" />
          ) : (
            <CircleAlert className="h-4 w-4" />
          )}
          {flash.text}
        </div>
      )}

      {/* Auto-discover via Google */}
      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Auto-discover with Google
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect the Google account that owns your Firebase projects to list
            and add them automatically — no service-account JSON needed.
          </p>
        </div>
        <GoogleConnectionCard status={googleStatus} />
      </section>

      {/* Connected Firebase projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
            <Database className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Connected Firebase projects
          </h2>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {projects.length} connected
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-500">
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
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Connect a project manually (service-account JSON)
          </h3>
          <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
            Use this when you&apos;d rather not connect Google, or for a project
            owned by a different account.
          </p>
          <ConnectFirebaseForm />
        </div>
      </section>

      {/* Owner login */}
      <section className="space-y-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">Your login (owner)</h2>
        <AccountSettingsForm
          currentEmail={account.email}
          source={account.source}
        />
      </section>

      {/* Team logins */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Team logins
          </h2>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {team.length} member{team.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create a login for each teammate so they can sign in with their own
          email and password — no redeploy needed. Set a password and share it
          with them; they can ask you to reset it any time.
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {team.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              No team logins yet — create one below.
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Added</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((u) => (
                  <TeamMemberRow
                    key={u.id}
                    id={u.id}
                    email={u.email}
                    name={u.name}
                    createdAt={u.createdAt}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <AddTeamMemberForm />
      </section>
    </div>
  );
}
