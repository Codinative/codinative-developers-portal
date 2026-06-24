"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; title: string };

// Sticky "On this page" nav. Anchor links jump to each section; an
// IntersectionObserver highlights the section currently in view.
export function DocToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-20">
      <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-gray-200 dark:border-gray-800">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 text-sm transition ${
                active === item.id
                  ? "border-indigo-500 font-medium text-indigo-600 dark:border-indigo-400 dark:text-indigo-300"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-white"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
