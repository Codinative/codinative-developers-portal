import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  CalendarDays,
  LayoutTemplate,
  PanelsTopLeft,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { DocPager } from "@/components/public/DocPager";
import {
  ADMIN_GUIDE_HREF,
  STENCIL_DAYS,
  STENCIL_TRACK_HREF,
} from "@/components/public/quick-start";

export const metadata: Metadata = {
  title: "Quick Start - Codinative Developers",
};

type Track = {
  icon: LucideIcon;
  title: string;
  duration: string;
  desc: string;
  href?: string;
};

const COMING_SOON: Track[] = [
  {
    icon: Puzzle,
    title: "BigCommerce Widget Builder Quick Start",
    duration: "1 day",
    desc: "Build a merchant-editable Page Builder widget end to end: the widget schema, the template, and placing it into theme regions.",
  },
  {
    icon: Blocks,
    title: "BigCommerce App Quick Start",
    duration: "5 days",
    desc: "Scaffold, install, and ship a single-click app: the OAuth install flow, the Management API from a server, BigDesign UI, and webhooks.",
  },
];

export default function QuickStartHub() {
  return (
    <div className="mx-auto max-w-5xl py-10">
      <header>
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
          Learn by building
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          Quick Start
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Hands-on tracks that take you from zero to shipping on BigCommerce in days, not
          months. Each one is a sequence of real tasks: you run the commands, write the code,
          and finish with something that works on a real store.
        </p>
      </header>

      <section className="mt-10">
        <Link
          href={STENCIL_TRACK_HREF}
          className="group block rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 transition hover:border-indigo-300 hover:shadow-lg sm:p-8 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-gray-900 dark:hover:border-indigo-500/50"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <LayoutTemplate className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase">
                <CalendarDays className="h-3 w-3" /> 5 days &middot; Start here
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                Stencil Theme Development Quick Start
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Set up Cornerstone locally, add JavaScript and React, query products with
                GraphQL, add to cart with the REST Storefront API, then combine all of it into a
                production-style &ldquo;Build Your Set&rdquo; page.
              </p>
              <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {STENCIL_DAYS.map((d) => (
                  <li
                    key={d.slug}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-gray-900 dark:text-indigo-200 dark:ring-indigo-500/30">
                      {d.day}
                    </span>
                    {d.title}
                  </li>
                ))}
              </ol>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition group-hover:gap-2.5 dark:text-indigo-300">
                Start Day 1 <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {COMING_SOON.map((t) => (
          <div
            key={t.title}
            aria-disabled
            className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-300 bg-white/60 p-5 dark:border-gray-700 dark:bg-gray-900/40"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <t.icon className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-800 uppercase dark:bg-amber-500/15 dark:text-amber-300">
                Coming soon
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                {t.duration}
              </p>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">{t.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Reference</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep this open alongside any track.
        </p>
        <Link
          href={ADMIN_GUIDE_HREF}
          className="group mt-4 flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <PanelsTopLeft className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="flex items-center justify-between font-medium text-gray-900 dark:text-gray-100">
              Developer&rsquo;s Guide to the BigCommerce Admin Panel
              <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500 dark:text-gray-600" />
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              The control panel from a developer&rsquo;s point of view: API tokens (which one,
              when), Page Builder, uploading and downloading themes, products, variants,
              categories, brands, web pages, images, scripts, and more.
            </p>
          </div>
        </Link>
      </section>

      <DocPager />
    </div>
  );
}
