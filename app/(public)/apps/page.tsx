import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PROJECT_GROUPS, type Project } from "@/lib/portal-projects";

export const metadata: Metadata = {
  title: "Projects - Codinative Developers",
};

export default function AppsPage() {
  const total = PROJECT_GROUPS.reduce((n, g) => n + g.projects.length, 0);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        What we have built
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
        {total} internal projects across BigCommerce, Shopify, and our own tooling. Every repository
        lives under the Codinative GitHub organization.
      </p>

      <div className="mt-10 space-y-12">
        {PROJECT_GROUPS.map((group) => (
          <div key={group.category}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {group.category}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{group.blurb}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.projects.map((p) => (
                <ProjectCard key={p.name} project={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { name, stack, description, repo, legacy } = project;
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-mono text-sm font-semibold break-all text-gray-900 dark:text-gray-100">
          {name}
        </h3>
        {legacy && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
            Legacy
          </span>
        )}
      </div>
      <span className="mt-2 inline-flex w-fit rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
        {stack}
      </span>
      <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300"
        >
          View repo <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
