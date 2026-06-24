import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DocToc, type TocItem } from "@/components/public/DocToc";

// Small, shared building blocks for the public docs pages (Server Components).

export type { TocItem };

export function DocLayout({
  title,
  intro,
  toc,
  children,
}: {
  title: string;
  intro?: string;
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/docs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All docs
      </Link>

      <div className="mt-4 gap-12 lg:grid lg:grid-cols-[1fr_13rem]">
        <article className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            {title}
          </h1>
          {intro && <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{intro}</p>}
          <div className="mt-10 space-y-10">{children}</div>
        </article>

        {toc && toc.length > 0 && (
          <aside className="hidden lg:block">
            <DocToc items={toc} />
          </aside>
        )}
      </div>
    </div>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
      <code className="font-mono">{children}</code>
    </pre>
  );
}

export function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-800 dark:bg-gray-800 dark:text-gray-200">
      {children}
    </code>
  );
}

export function Callout({
  tone = "info",
  children,
}: {
  tone?: "info" | "warn";
  children: React.ReactNode;
}) {
  const styles =
    tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
      : "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200";
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="ml-5 list-decimal space-y-2 text-sm leading-relaxed text-gray-600 marker:text-gray-400 dark:text-gray-300">
      {children}
    </ol>
  );
}
