"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "./docs-nav";

// Persistent left-hand index for the docs section. Grouped like the docs
// themselves; the current page is highlighted via the active pathname.

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav
        aria-label="Documentation"
        className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-6 overflow-y-auto py-10 pr-2"
      >
        {DOCS_NAV.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-3 py-1.5 text-sm transition ${
                        active
                          ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
