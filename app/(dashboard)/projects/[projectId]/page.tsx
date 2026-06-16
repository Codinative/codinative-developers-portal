import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Link2, KeyRound } from "lucide-react";
import { getProject } from "@/actions/project-hub";
import { getSecretsByApp } from "@/actions/secrets";
import { AddLinkForm } from "@/components/projects/AddLinkForm";
import { LinkRow } from "@/components/projects/LinkRow";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import { AddSecretForm } from "@/components/AddSecretForm";
import { SecretRow } from "@/components/SecretRow";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  // Secrets reuse the shared vault, keyed by the project id as the appId.
  const secrets = await getSecretsByApp(project.id);

  return (
    <div className="space-y-8">
      {/* header */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" /> Projects
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {project.description || (
                <span className="font-mono text-xs">{project.slug}</span>
              )}
            </p>
          </div>
          <DeleteProjectButton id={project.id} name={project.name} />
        </div>
      </div>

      {/* links */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
          <Link2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          Links
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {project.links.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              No links yet — add the repo, live app, marketplace listing, docs, designs…
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {project.links.map((link) => (
                <LinkRow key={link.id} projectId={project.id} link={link} />
              ))}
            </div>
          )}
        </div>
        <AddLinkForm projectId={project.id} />
      </section>

      {/* secrets */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-gray-100">
            <KeyRound className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Secrets &amp; env variables
          </h2>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {secrets.length} secret{secrets.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AES-encrypted at rest, decrypted only server-side — revealed values are never logged.
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {secrets.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              No secrets added yet for this project
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
        <AddSecretForm appId={project.id} />
      </section>
    </div>
  );
}
