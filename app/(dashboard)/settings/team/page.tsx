import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { getTeamUsers } from "@/actions/users";
import { AddTeamMemberForm } from "@/components/AddTeamMemberForm";
import { TeamMemberRow } from "@/components/TeamMemberRow";
import { SettingsTabs } from "@/components/SettingsTabs";

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage() {
  const session = await auth();
  const isOwner = session?.user?.role === "owner";

  // Defense in depth — the Team tab link is hidden for non-owners, but a
  // member could still hit this URL directly.
  if (!isOwner) redirect("/settings");

  const team = await getTeamUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add, edit, or remove teammates&apos; logins — no redeploy needed.
        </p>
      </div>

      <SettingsTabs active="team" isOwner={isOwner} />

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
          with them; they can change it any time from their own Settings, or
          you can reset it here.
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Role</th>
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
                    role={u.role}
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
