"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Copy, Check, Trash2 } from "lucide-react";
import { deleteLink, type ProjectLink } from "@/actions/project-hub";
import { LinkTypeBadge, getLinkType } from "./link-types";

export function LinkRow({
  projectId,
  link,
}: {
  projectId: string;
  link: ProjectLink;
}) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const type = getLinkType(link.type);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard can fail on insecure origins; ignore */
    }
  }

  function handleDelete() {
    if (!confirm(`Delete the "${link.label}" link?`)) return;
    startDelete(async () => {
      await deleteLink(projectId, link.id);
    });
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        isDeleting ? "opacity-40" : ""
      }`}
    >
      <LinkTypeBadge type={type} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {link.label}
          </span>
          <span className="hidden shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline dark:bg-gray-800 dark:text-gray-400">
            {type.label}
          </span>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-xs text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {link.url}
        </a>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open
        </a>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete link"
          className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
