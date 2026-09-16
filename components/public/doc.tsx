import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { ShieldAlert, Hammer, ImageIcon, CircleCheck } from "lucide-react";
import { DocToc, type TocItem } from "@/components/public/DocToc";
import { DocPager } from "@/components/public/DocPager";

// Small, shared building blocks for the public docs pages (Server Components).

export type { TocItem };

export function DocLayout({
  title,
  intro,
  toc,
  header,
  children,
}: {
  title: string;
  intro?: string;
  toc?: TocItem[];
  // Optional content above the title (e.g. a track's day tabs).
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl py-10">
      <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
        <article className="min-w-0 xl:flex-1">
          {header && <div className="mb-8">{header}</div>}
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            {title}
          </h1>
          {intro && <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">{intro}</p>}
          <div className="mt-10 space-y-10">{children}</div>
          <DocPager />
        </article>

        {toc && toc.length > 0 && (
          <aside className="hidden shrink-0 xl:block xl:w-56">
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
  tone?: "info" | "warn" | "success";
  children: React.ReactNode;
}) {
  const styles =
    tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
        : "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200";
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

// Prominent red box for security-critical rules (leaked tokens, server-only
// APIs). Deliberately louder than a Callout so it can't be skimmed past.
export function SecurityAlert({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border-2 border-red-500 bg-red-50 p-4 text-sm text-red-900 shadow-sm dark:border-red-500/70 dark:bg-red-500/10 dark:text-red-100"
    >
      <p className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300">
        <ShieldAlert className="h-5 w-5 shrink-0" />
        <span className="uppercase tracking-wide">Security</span>
        <span aria-hidden>&middot;</span>
        <span>{title}</span>
      </p>
      <div className="mt-2 space-y-2 leading-relaxed">{children}</div>
    </div>
  );
}

// A hands-on exercise block: what to build and how to know you're done.
export function Task({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-500/30 dark:bg-gray-900">
      <p className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
        <Hammer className="h-4 w-4" /> {title}
      </p>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

// "You should now see..." verification step at the end of a task.
export function Checkpoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div className="space-y-1.5">
        <p className="font-semibold text-emerald-800 dark:text-emerald-200">Checkpoint</p>
        <div className="space-y-1.5">{children}</div>
      </div>
    </div>
  );
}

// Code block with a filename / language label. Use for files the reader creates
// or edits so it's always clear *where* a snippet goes.
export function CodeFile({ name, children }: { name: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <p className="border-b border-gray-200 bg-gray-100 px-4 py-1.5 font-mono text-[11px] text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        {name}
      </p>
      <pre className="overflow-x-auto bg-gray-50 p-4 text-xs leading-relaxed text-gray-800 dark:bg-gray-950 dark:text-gray-200">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}

// Screenshot slot. Renders the image once the file exists under /public;
// until then it shows a labelled placeholder so the missing capture is obvious.
export function Screenshot({
  file,
  alt,
  caption,
}: {
  // Path relative to public/docs/screenshots, e.g. "admin/api-accounts.png".
  file: string;
  alt: string;
  caption?: string;
}) {
  const src = `/docs/screenshots/${file}`;
  const exists = fs.existsSync(path.join(process.cwd(), "public", "docs", "screenshots", file));

  return (
    <figure className="my-1">
      {exists ? (
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          className="h-auto w-full rounded-lg border border-gray-200 dark:border-gray-800"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center dark:border-gray-700 dark:bg-gray-900/40">
          <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Screenshot placeholder
          </p>
          <p className="max-w-md text-xs text-gray-500 dark:text-gray-400">{alt}</p>
          <code className="rounded bg-gray-200/70 px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            public{src}
          </code>
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="ml-5 list-decimal space-y-2 text-sm leading-relaxed text-gray-600 marker:text-gray-400 dark:text-gray-300">
      {children}
    </ol>
  );
}

// External link to an authoritative doc (opens in a new tab). Shared across all
// docs pages so the curriculum can route out to BigCommerce consistently.
export function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-600 underline-offset-2 transition hover:underline dark:text-indigo-300"
    >
      {children}
    </a>
  );
}
