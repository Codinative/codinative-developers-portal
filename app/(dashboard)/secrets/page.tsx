import { KeyRound } from "lucide-react";
import { getSecretsByApp } from "@/actions/secrets";
import { GENERAL_SCOPE } from "@/lib/secrets-config";
import { SecretRow } from "@/components/SecretRow";
import { AddSecretForm } from "@/components/AddSecretForm";

export const dynamic = "force-dynamic";

export default async function SecretsPage() {
  const secrets = await getSecretsByApp(GENERAL_SCOPE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <KeyRound className="h-5 w-5" />
          </span>
          Secrets
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          A general encrypted vault for API keys, tokens and environment
          variables. Values are AES-encrypted at rest and only decrypted
          server-side — revealed values are never logged. For credentials tied to
          a specific project, use that project&apos;s page instead.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {secrets.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No secrets yet — add one below.
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

      <AddSecretForm appId={GENERAL_SCOPE} />
    </div>
  );
}
