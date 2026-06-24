import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Boxes,
  Store,
  ShoppingBag,
  Terminal,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Codinative Developers Portal",
};

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            Codinative Engineering
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-50">
            The Codinative Developers Portal
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            One place for our engineering docs, platform guidelines, and a map of everything we
            have built across BigCommerce and Shopify. Open to every developer - no login needed.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Browse the docs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              See our projects
            </Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <FeatureCard
            href="/docs"
            icon={BookOpen}
            title="Documentation"
            desc="Platform guidelines for BigCommerce and Shopify: tokens, CLIs, and team workflows."
          />
          <FeatureCard
            href="/apps"
            icon={Boxes}
            title="Projects"
            desc="A breakdown of every app, automation, and service we have built internally."
          />
          <FeatureCard
            href="/login"
            icon={Store}
            title="Team workspace"
            desc="Codinative staff sign in here for projects, QA, and the secrets vault."
          />
        </div>
      </section>

      {/* Doc tracks */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
          Documentation tracks
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TrackCard
            href="/docs/bigcommerce"
            icon={ShoppingBag}
            title="BigCommerce"
            desc="Create API accounts, understand v2 vs v3 tokens, and set up the Stencil CLI for theme work."
          />
          <TrackCard
            href="/docs/shopify"
            icon={Terminal}
            title="Shopify"
            desc="Install the Shopify CLI, then pull, preview, and push themes safely with our versioning convention."
          />
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof BookOpen;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </Link>
  );
}

function TrackCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof BookOpen;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <h3 className="flex items-center justify-between font-medium text-gray-900 dark:text-gray-100">
          {title}
          <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500 dark:text-gray-600" />
        </h3>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
    </Link>
  );
}
