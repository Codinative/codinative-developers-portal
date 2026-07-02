"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DOCS_ORDER } from "./docs-nav";

// Previous / next links at the bottom of a doc page, driven by the shared
// reading order. Renders nothing for pages outside that order.

export function DocPager() {
  const pathname = usePathname();
  const idx = DOCS_ORDER.findIndex((item) => item.href === pathname);
  if (idx === -1) return null;

  const prev = idx > 0 ? DOCS_ORDER[idx - 1] : null;
  const next = idx < DOCS_ORDER.length - 1 ? DOCS_ORDER[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Previous and next page"
      className="mt-16 grid gap-4 border-t border-gray-200 pt-8 sm:grid-cols-2 dark:border-gray-800"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col rounded-xl border border-gray-200 p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-indigo-500/40"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </span>
          <span className="mt-1 font-medium text-gray-900 transition group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-300">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end rounded-xl border border-gray-200 p-4 text-right transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-indigo-500/40"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Next <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 font-medium text-gray-900 transition group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-300">
            {next.label}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
    </nav>
  );
}
