import { getAppList } from "@/actions/projects";
import { getSecretsByApp } from "@/actions/secrets";
import { SecretRow } from "@/components/SecretRow";
import { AddSecretForm } from "@/components/AddSecretForm";

export const dynamic = "force-dynamic";

export default async function SecretsPage() {
  const apps = await getAppList();
  const allSecrets = await Promise.all(
    apps.map(async (app) => ({ app, secrets: await getSecretsByApp(app.id) })),
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Secrets &amp; env variables</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Store API keys, tokens and environment variables per project. All
          values are AES-encrypted at rest and only decrypted server-side —
          revealed values are never logged.
        </p>
      </div>

      {allSecrets.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No apps yet. Connect a Firebase project in Settings to start storing
          its secrets here.
        </p>
      )}

      {allSecrets.map(({ app, secrets }) => (
        <section key={app.id}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">{app.name}</h2>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {secrets.length} secret{secrets.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {secrets.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                No secrets added yet for this app
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Key</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Added</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {secrets.map((secret) => (
                    <SecretRow
                      key={secret.id}
                      id={secret.id}
                      secretKey={secret.key}
                      value={secret.value}
                      appId={secret.appId}
                      addedAt={secret.addedAt}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <AddSecretForm appId={app.id} />
        </section>
      ))}
    </div>
  );
}
