"use client";

import { useTransition } from "react";
import { Trash2, CircleCheck, CircleAlert, Database } from "lucide-react";
import { removeFirebaseProject } from "@/actions/projects";
import { ACCENTS } from "@/lib/accent";
import type { AccentColor } from "@/lib/projects-store";

export type ConnectedProjectView = {
  id: string;
  appId: string;
  name: string;
  color: AccentColor;
  firebaseProjectId: string;
  clientEmailMasked: string;
  metricLabels: string[];
  status: "live" | "error";
  error?: string;
};

export function ConnectedProjectCard({
  project,
}: {
  project: ConnectedProjectView;
}) {
  const [isPending, startTransition] = useTransition();
  const accent = ACCENTS[project.color];

  function handleRemove() {
    if (
      !confirm(
        `Remove "${project.name}"? Its stored credentials will be deleted. ` +
          `Secrets saved under this app are not affected.`,
      )
    )
      return;
    startTransition(async () => {
      await removeFirebaseProject(project.id);
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${accent.dot}`} />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Database className="h-3.5 w-3.5" />
              {project.firebaseProjectId}
            </p>
            <p className="mt-1 break-all font-mono text-xs text-gray-400 dark:text-gray-500">
              {project.clientEmailMasked}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          disabled={isPending}
          title="Remove project"
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:text-gray-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {project.status === "live" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <CircleCheck className="h-3.5 w-3.5" /> Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <CircleAlert className="h-3.5 w-3.5" /> Read error
          </span>
        )}
        {project.metricLabels.map((label) => (
          <span
            key={label}
            className={`rounded-full px-2 py-0.5 text-xs ${accent.chipBg} ${accent.chipText}`}
          >
            {label}
          </span>
        ))}
      </div>
      {project.status === "error" && project.error && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">{project.error}</p>
      )}
    </div>
  );
}
