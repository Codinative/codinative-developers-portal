import { Children, Fragment, type ReactNode } from "react";

// Reusable, responsive, dark-mode-aware illustration primitives for the
// BigCommerce Mastery curriculum. Server Components - no client JS. Every
// diagram reflows on small screens (horizontal flows stack vertically,
// matrices collapse to cards, trees/timelines scroll or stack) rather than
// clipping.

export function Diagram({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-1 rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/40">
      <div>{children}</div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Flow - horizontal boxed steps joined by arrows; stacks vertically on mobile.
// ---------------------------------------------------------------------------

export function Flow({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children);
  return (
    <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
      {steps.map((step, i) => (
        <Fragment key={i}>
          {step}
          {i < steps.length - 1 && <FlowArrow />}
        </Fragment>
      ))}
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center justify-center text-lg leading-none text-gray-400 dark:text-gray-500"
    >
      <span className="md:hidden">&#8595;</span>
      <span className="hidden md:inline">&#8594;</span>
    </div>
  );
}

export function FlowStep({
  title,
  desc,
  tone = "default",
}: {
  title: string;
  desc?: string;
  tone?: "default" | "accent";
}) {
  const styles =
    tone === "accent"
      ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/10"
      : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900";
  return (
    <div className={`flex-1 rounded-lg border px-3 py-2.5 text-center ${styles}`}>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
      {desc && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FileTree - annotated, indented tree. Notes wrap below names on mobile and
// sit to the right on larger screens; horizontal scroll for deep nesting.
// ---------------------------------------------------------------------------

export type FileTreeLine = {
  name: string;
  depth?: number;
  note?: string;
  dir?: boolean;
};

export function FileTree({ lines }: { lines: FileTreeLine[] }) {
  return (
    <div className="overflow-x-auto">
      <ul className="font-mono text-xs">
        {lines.map((line, i) => (
          <li
            key={i}
            className="flex flex-col gap-0.5 py-0.5 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <span
              style={{ paddingLeft: `${(line.depth ?? 0) * 1.25}rem` }}
              className={
                line.dir
                  ? "font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-300"
                  : "whitespace-nowrap text-gray-700 dark:text-gray-300"
              }
            >
              {line.name}
              {line.dir ? "/" : ""}
            </span>
            {line.note && (
              <span className="text-[11px] text-gray-400 sm:ml-auto sm:text-right dark:text-gray-500">
                {line.note}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spectrum - low-level -> high-level gradient with ordered, responsive cards.
// ---------------------------------------------------------------------------

export type SpectrumItem = { label: string; audience: string; desc?: string };

export function Spectrum({
  from,
  to,
  items,
}: {
  from: string;
  to: string;
  items: SpectrumItem[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
        <span>&#9668; {from}</span>
        <span>{to} &#9658;</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-400 to-amber-400" />
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
              {item.audience}
            </p>
            {item.desc && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Matrix - 2x2 with axis labels on desktop; stacked labeled cards on mobile.
// ---------------------------------------------------------------------------

type Cell = { title: string; desc?: string };

export function Matrix({
  colLabels,
  rowLabels,
  cells,
}: {
  colLabels: [string, string];
  rowLabels: [string, string];
  cells: [[Cell, Cell], [Cell, Cell]];
}) {
  const rows = [0, 1] as const;
  const cols = [0, 1] as const;
  return (
    <>
      <div className="hidden grid-cols-[6.5rem_1fr_1fr] gap-2 sm:grid">
        <div />
        {colLabels.map((c) => (
          <div
            key={c}
            className="text-center text-xs font-semibold text-gray-700 dark:text-gray-200"
          >
            {c}
          </div>
        ))}
        {rows.map((r) => (
          <Fragment key={r}>
            <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200">
              {rowLabels[r]}
            </div>
            {cols.map((c) => (
              <div
                key={c}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {cells[r][c].title}
                </p>
                {cells[r][c].desc && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {cells[r][c].desc}
                  </p>
                )}
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <div className="space-y-2 sm:hidden">
        {rows.map((r) =>
          cols.map((c) => (
            <div
              key={`${r}-${c}`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            >
              <p className="text-[10px] font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
                {rowLabels[r]} &middot; {colLabels[c]}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {cells[r][c].title}
              </p>
              {cells[r][c].desc && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{cells[r][c].desc}</p>
              )}
            </div>
          )),
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// DecisionTree - "if yes -> outcome, else next"; stacks on mobile.
// ---------------------------------------------------------------------------

export function DecisionTree({
  steps,
  fallback,
}: {
  steps: { question: string; yes: string }[];
  fallback: string;
}) {
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div key={i}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {step.question}
              </p>
            </div>
            <div className="flex items-stretch gap-2">
              <span className="flex items-center text-xs font-semibold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                Yes &#8594;
              </span>
              <div className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <p className="text-sm text-emerald-900 dark:text-emerald-200">{step.yes}</p>
              </div>
            </div>
          </div>
          <p className="py-1 pl-1 text-xs text-gray-400 dark:text-gray-500">&#8595; No</p>
        </div>
      ))}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 dark:border-indigo-500/30 dark:bg-indigo-500/10">
        <p className="text-sm text-indigo-900 dark:text-indigo-200">
          <span className="font-semibold">Otherwise: </span>
          {fallback}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline - dated markers on a vertical rail (responsive at every width).
// ---------------------------------------------------------------------------

export function Timeline({
  events,
}: {
  events: { date: string; label: string; tone?: "default" | "warn" }[];
}) {
  return (
    <ol className="relative space-y-4 border-l border-gray-200 pl-5 dark:border-gray-700">
      {events.map((e, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden
            className={`absolute top-1 -left-[1.6rem] h-2.5 w-2.5 rounded-full ring-4 ring-gray-50 dark:ring-gray-900/40 ${
              e.tone === "warn" ? "bg-amber-500" : "bg-indigo-500"
            }`}
          />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{e.date}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{e.label}</p>
        </li>
      ))}
    </ol>
  );
}
