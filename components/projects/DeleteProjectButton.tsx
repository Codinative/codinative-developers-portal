"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/actions/project-hub";

export function DeleteProjectButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${name}"? Its links and secrets will be removed.`)) return;
    startDelete(async () => {
      const res = await deleteProject(id);
      if (res.success) router.push("/projects");
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  );
}
