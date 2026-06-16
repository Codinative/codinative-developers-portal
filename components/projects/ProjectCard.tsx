"use client";

import Link from "next/link";
import { useTransition } from "react";
import { FolderKanban, Link2, Trash2, ArrowUpRight } from "lucide-react";
import { deleteProject, type HubProjectSummary } from "@/actions/project-hub";

export function ProjectCard({ project }: { project: HubProjectSummary }) {
  const [isDeleting, startDelete] = useTransition();
  const { id, name, slug, description, linkCount, updatedAt } = project;

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${name}"? Its links and secrets will be removed.`)) return;
    startDelete(async () => {
      await deleteProject(id);
    });
  }

  return (
    <Link
      href={`/projects/${id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40 dark:hover:shadow-black/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <FolderKanban className="h-4 w-4" />
          </span>
          <h3 className="truncate font-medium text-gray-900 dark:text-gray-100">{name}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete project"
            className="rounded-md border border-gray-200 p-1.5 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500 dark:text-gray-600 dark:group-hover:text-indigo-400" />
        </div>
      </div>

      <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {description || <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{slug}</span>}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" /> {linkCount} link{linkCount !== 1 ? "s" : ""}
        </span>
        {updatedAt && <span>· Updated {new Date(updatedAt).toLocaleDateString()}</span>}
      </div>
    </Link>
  );
}
