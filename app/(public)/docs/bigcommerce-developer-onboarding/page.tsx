import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  GitBranch,
  SlidersHorizontal,
  Blocks,
  Rocket,
  Sparkles,
  Workflow,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "BigCommerce Developer Onboarding - Codinative Developers",
};

type Module = {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  teamOnly?: boolean;
};

const LEARNING_PATH: Module = {
  href: "/docs/bigcommerce-developer-onboarding/guided-coursework",
  icon: GraduationCap,
  title: "Guided Coursework",
  desc: "The curated order to take BigCommerce's official training courses - Developer Foundations, Stencil Developer, and B2B Developer - with your progress tracked as you go. The heavy lifting of teaching the platform is done by BigCommerce; this is the map.",
};

const PATH_STATS = ["4 phases", "10 courses", "~84h of content"];

const SUPPLEMENTARY: Module[] = [
  {
    href: "/docs/bigcommerce-developer-onboarding/customization-surfaces",
    icon: SlidersHorizontal,
    title: "Customization Surfaces",
    desc: "The low-level to high-level customization spectrum: CLI + SCSS/JS, custom templates, the Widgets API, WebDAV, the Code Editor, Script Manager, and Page Builder / Theme Styles.",
  },
  {
    href: "/docs/bigcommerce-developer-onboarding/apps-and-integrations",
    icon: Blocks,
    title: "Apps & Integrations",
    desc: "Types of apps, the OAuth install flow, app extensions, the Next.js starter app, channels, BigDesign, and publishing to the marketplace.",
  },
  {
    href: "/docs/bigcommerce-developer-onboarding/catalyst-and-headless",
    icon: Rocket,
    title: "Catalyst & Headless",
    desc: "Catalyst (Next.js + React Server Components + Makeswift), fully headless patterns on the Storefront APIs, multi-storefront, and the WordPress plugin - what each is and when to reach for it.",
  },
  {
    href: "/docs/bigcommerce-developer-onboarding/using-the-bigcommerce-docs",
    icon: Sparkles,
    title: "Using the BigCommerce Docs",
    desc: "Navigate the BigCommerce docs efficiently and use their AI tooling - Ask AI, Copy as Markdown, Open in Claude/ChatGPT, Connect to Cursor/Claude Code, the docs MCP server, and llms.txt.",
  },
  {
    href: "/docs/bigcommerce-developer-onboarding/git-and-github",
    icon: GitBranch,
    title: "Git & GitHub",
    desc: "The practical minimum to work day to day: staging and committing, branches, pushing, pull requests, merging, resolving conflicts, stashing, and rebasing - with hands-on resources to learn from.",
  },
];

// Team-only module — appended last in Beyond the Courses for signed-in members only.
const TEAM_MODULES: Module[] = [
  {
    href: "/docs/bigcommerce-developer-onboarding/development-process",
    icon: Workflow,
    title: "Development Process",
    desc: "How we actually build at Codinative: the .claude process kit + Claude Code workflow - the mental model, Day-0 setup, the Definition of Done, pair-reviewed PRs, releases, and the hard rules. Read it before your first project.",
    teamOnly: true,
  },
];

export default async function MasteryHub() {
  const session = await auth();
  const beyondModules = session?.user ? [...SUPPLEMENTARY, ...TEAM_MODULES] : SUPPLEMENTARY;

  return (
    <div className="mx-auto max-w-5xl py-10">
      <header className="mt-4">
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
          Self-serve curriculum
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          BigCommerce Developer Onboarding
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Your onboarding, in two stages: first complete the <strong>Guided Coursework</strong> -
          BigCommerce&rsquo;s official training, sequenced for Codinative - then work through{" "}
          <strong>Beyond the Courses</strong>, the essential topics that connect it to how we
          build. Both stages matter; do them in order.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          How to use this curriculum
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <p>
            BigCommerce maintains excellent, certified training courses, so we don&rsquo;t
            re-teach the platform here. <strong>Start with the Guided Coursework</strong> - it
            sequences those official courses in the order that works best for Codinative,
            and tracks your progress as you go.
          </p>
          <p>
            Once the coursework is done, move on to <strong>Beyond the Courses</strong>. Those
            modules are essential too - they cover the customization surfaces, app building,
            Catalyst / headless, and getting the most out of the docs and their AI tooling -
            framed in our own words and linked to the authoritative BigCommerce documentation.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <FeaturedCard {...LEARNING_PATH} stats={PATH_STATS} />
      </section>

      <section className="mt-12">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
            Next
          </span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Beyond the Courses
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Essential topics to cover once you&rsquo;ve completed the Guided Coursework - these
          connect the official courses to how Codinative actually builds.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {beyondModules.map((m) => (
            <ModuleCard key={m.href} {...m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({
  href,
  icon: Icon,
  title,
  desc,
  stats,
}: Module & { stats: string[] }) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 transition hover:border-indigo-300 hover:shadow-lg sm:p-8 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-gray-900 dark:hover:border-indigo-500/50"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase">
            Start here
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {desc}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {stats.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 ring-inset dark:bg-gray-900/60 dark:text-indigo-200 dark:ring-indigo-500/30"
              >
                {s}
              </span>
            ))}
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition group-hover:gap-2.5 dark:text-indigo-300">
            Start the coursework <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ModuleCard({ href, icon: Icon, title, desc, teamOnly }: Module) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="flex items-center justify-between gap-2 font-medium text-gray-900 dark:text-gray-100">
          <span className="inline-flex items-center gap-2">
            {title}
            {teamOnly && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
                <Lock className="h-2.5 w-2.5" /> Team only
              </span>
            )}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-indigo-500 dark:text-gray-600" />
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
    </Link>
  );
}
