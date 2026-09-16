"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, ArrowRight, RotateCcw } from "lucide-react";
import { STENCIL_DAYS, STENCIL_PROGRESS_KEY } from "./quick-start";

// Day tabs + completion tracking for the 5-day Stencil Quick Start. Progress is
// per-browser (localStorage) - a personal checklist, not a gate: every day stays
// open so a developer can jump back to reference material at any time.

const CHANGE_EVENT = "cn-quickstart-progress";

function readProgress(): number[] {
  try {
    const raw = window.localStorage.getItem(STENCIL_PROGRESS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function writeProgress(days: number[]) {
  try {
    window.localStorage.setItem(STENCIL_PROGRESS_KEY, JSON.stringify(days));
  } catch {
    // Storage unavailable (private mode) - progress just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function useProgress() {
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setDone(readProgress());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((day: number) => {
    const current = readProgress();
    writeProgress(
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b),
    );
  }, []);

  const reset = useCallback(() => writeProgress([]), []);

  return { done, toggle, reset };
}

// Horizontal tab strip shown at the top of every day page.
export function DayTabs() {
  const pathname = usePathname();
  const { done } = useProgress();

  return (
    <nav aria-label="Quick Start days" className="-mx-1 overflow-x-auto pb-1">
      <ol className="flex min-w-max gap-2 px-1">
        {STENCIL_DAYS.map((d) => {
          const active = pathname === d.href;
          const complete = done.includes(d.day);
          return (
            <li key={d.slug}>
              <Link
                href={d.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  active
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-500/60 dark:bg-indigo-500/15 dark:text-indigo-200"
                    : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-indigo-500/40 dark:hover:text-white"
                }`}
              >
                {complete ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {d.day}
                  </span>
                )}
                <span className="whitespace-nowrap">
                  <span className="font-medium">Day {d.day}</span>
                  <span className="hidden sm:inline"> &middot; {d.short}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// "Mark day complete" control at the end of a day page, with a link onward.
export function DayComplete({ day }: { day: number }) {
  const { done, toggle } = useProgress();
  const complete = done.includes(day);
  const next = STENCIL_DAYS.find((d) => d.day === day + 1);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {complete ? `Day ${day} complete - nice work.` : `Finished every task for Day ${day}?`}
        </p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Progress is saved in this browser only.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => toggle(day)}
          aria-pressed={complete}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            complete
              ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          {complete ? "Completed" : "Mark as complete"}
        </button>
        {next && (
          <Link
            href={next.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Day {next.day} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

// Syllabus list on the track overview page, with live completion state.
export function DaySyllabus() {
  const { done, reset } = useProgress();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-gray-100">{done.length}</strong> of{" "}
          {STENCIL_DAYS.length} days complete
        </p>
        {done.length > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset progress
          </button>
        )}
      </div>
      <div
        className="mb-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={STENCIL_DAYS.length}
        aria-valuenow={done.length}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all"
          style={{ width: `${(done.length / STENCIL_DAYS.length) * 100}%` }}
        />
      </div>
      <ol className="space-y-3">
        {STENCIL_DAYS.map((d) => {
          const complete = done.includes(d.day);
          return (
            <li key={d.slug}>
              <Link
                href={d.href}
                className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                    complete
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                  }`}
                >
                  {complete ? <CheckCircle2 className="h-5 w-5" /> : `D${d.day}`}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                    Day {d.day}
                  </p>
                  <h3 className="flex items-center justify-between gap-2 font-medium text-gray-900 dark:text-gray-100">
                    {d.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-gray-600" />
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{d.summary}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
