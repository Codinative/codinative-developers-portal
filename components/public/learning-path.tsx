"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  BookOpen,
  ArrowUpRight,
  RotateCcw,
  GraduationCap,
} from "lucide-react";

// Interactive curated coursework tracker. Progress is strictly sequential - a
// course only unlocks once every course before it is complete - and is saved in
// localStorage so a developer can return and see how far they've come.

export type PathCourse = {
  title: string;
  lessons: number;
  duration: string;
  desc: string;
  href: string;
};

export type PathPhase = {
  title: string;
  tag: string;
  sourceLabel?: string;
  sourceHref?: string;
  accent: AccentKey;
  note?: string;
  courses: PathCourse[];
};

type AccentKey = "slate" | "blue" | "teal" | "emerald";

const ACCENTS: Record<
  AccentKey,
  { bar: string; badge: string; text: string; soft: string }
> = {
  slate: {
    bar: "from-slate-500 to-slate-600",
    badge: "bg-slate-600",
    text: "text-slate-600 dark:text-slate-300",
    soft: "border-slate-200 bg-slate-50 dark:border-slate-500/30 dark:bg-slate-500/10",
  },
  blue: {
    bar: "from-blue-500 to-blue-600",
    badge: "bg-blue-600",
    text: "text-blue-600 dark:text-blue-300",
    soft: "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10",
  },
  teal: {
    bar: "from-teal-500 to-teal-600",
    badge: "bg-teal-600",
    text: "text-teal-700 dark:text-teal-300",
    soft: "border-teal-200 bg-teal-50 dark:border-teal-500/30 dark:bg-teal-500/10",
  },
  emerald: {
    bar: "from-emerald-500 to-emerald-600",
    badge: "bg-emerald-600",
    text: "text-emerald-700 dark:text-emerald-300",
    soft: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10",
  },
};

const STORAGE_KEY = "bc-mastery-coursework-progress-v2";

export function LearningPath({
  phases,
  totalLessons,
  totalHours,
}: {
  phases: PathPhase[];
  totalLessons: number;
  totalHours: string;
}) {
  const total = phases.reduce((n, p) => n + p.courses.length, 0);

  // `count` = number of leading courses completed, in flat order. Progress is a
  // contiguous prefix, so a course is only actionable once all before it are done.
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n)) setCount(Math.max(0, Math.min(n, total)));
      }
    } catch {
      // ignore unavailable / malformed storage
    }
    setMounted(true);
  }, [total]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(count));
    } catch {
      // ignore
    }
  }, [count, mounted]);

  // Click the next course to complete it; click a completed course to rewind to
  // just before it. Locked courses are inert.
  const onCourseClick = (globalIndex: number) => {
    if (globalIndex === count) setCount(globalIndex + 1);
    else if (globalIndex < count) setCount(globalIndex);
  };

  const pct = total ? Math.round((count / total) * 100) : 0;

  // Precompute each phase's starting offset in the flat course list.
  let offset = 0;
  const phaseData = phases.map((p) => {
    const start = offset;
    offset += p.courses.length;
    return { phase: p, start };
  });

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Your progress
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {count} of {total} courses complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">
              {pct}%
            </p>
            {count > 0 && (
              <button
                type="button"
                onClick={() => setCount(0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-500 transition hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-500 via-teal-500 to-emerald-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Stat icon={<GraduationCap className="h-3.5 w-3.5" />} label={`${total} courses`} />
          <Stat icon={<BookOpen className="h-3.5 w-3.5" />} label={`${totalLessons} lessons`} />
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label={`${totalHours} of content`} />
          <Stat icon={<span className="font-semibold">{phases.length}</span>} label="phases" />
        </div>
      </div>

      {/* Phases */}
      <ol className="space-y-4">
        {phaseData.map(({ phase, start }, i) => {
          const accent = ACCENTS[phase.accent];
          const phaseDone = count >= start + phase.courses.length;
          const phaseLocked = mounted && count < start;
          return (
            <li
              key={phase.title}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className={`h-1.5 bg-gradient-to-r ${accent.bar}`} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${accent.badge}`}
                  >
                    {phaseDone ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {phase.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${accent.soft} ${accent.text}`}
                      >
                        {phase.tag}
                      </span>
                    </div>
                    {phase.sourceLabel && phase.sourceHref && (
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Source plan:{" "}
                        {phaseLocked ? (
                          <span className="inline-flex items-center gap-1 font-medium text-gray-400 dark:text-gray-600">
                            {phase.sourceLabel} <Lock className="h-3 w-3" />
                          </span>
                        ) : (
                          <a
                            href={phase.sourceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium underline-offset-2 hover:underline ${accent.text}`}
                          >
                            {phase.sourceLabel}
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {phase.note && (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    {phase.note}
                  </p>
                )}

                <ul className="mt-4 space-y-2">
                  {phase.courses.map((course, ci) => {
                    const globalIndex = start + ci;
                    const done = mounted && globalIndex < count;
                    const isNext = mounted && globalIndex === count;
                    const locked = mounted && globalIndex > count;
                    return (
                      <li
                        key={course.title}
                        className={`group flex gap-3 rounded-xl border p-3 transition ${
                          done
                            ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/5"
                            : isNext
                              ? "border-indigo-200 bg-white ring-1 ring-indigo-100 dark:border-indigo-500/40 dark:bg-gray-950/40 dark:ring-indigo-500/20"
                              : "border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/40"
                        } ${locked ? "opacity-60" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => onCourseClick(globalIndex)}
                          disabled={locked}
                          aria-pressed={done}
                          title={
                            locked
                              ? "Complete the previous course first"
                              : done
                                ? "Completed - click to reset progress to here"
                                : "Mark this course complete"
                          }
                          aria-label={
                            locked
                              ? `${course.title} locked - complete the previous course first`
                              : done
                                ? `Mark ${course.title} incomplete`
                                : `Mark ${course.title} complete`
                          }
                          className={`mt-0.5 shrink-0 rounded-full transition ${
                            done
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isNext
                                ? "text-indigo-400 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                                : "cursor-not-allowed text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : locked ? (
                            <Lock className="h-[18px] w-[18px]" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {locked ? (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-gray-600">
                                {course.title}
                                <Lock className="h-3.5 w-3.5" />
                              </span>
                            ) : (
                              <a
                                href={course.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 text-sm font-medium transition hover:underline ${
                                  done
                                    ? "text-gray-500 line-through dark:text-gray-500"
                                    : "text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                {course.title}
                                <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                              </a>
                            )}
                            {isNext && (
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-700 uppercase dark:bg-indigo-500/20 dark:text-indigo-300">
                                Up next
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <Chip icon={<BookOpen className="h-3 w-3" />} label={`${course.lessons} lessons`} />
                            <Chip icon={<Clock className="h-3 w-3" />} label={course.duration} />
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                            {course.desc}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
      {icon}
      {label}
    </span>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500 ring-1 ring-gray-200 ring-inset dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-700">
      {icon}
      {label}
    </span>
  );
}
