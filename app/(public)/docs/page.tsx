import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, ShoppingBag, Terminal, GraduationCap, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Docs - Codinative Developers",
};

export default function DocsIndex() {
  return (
    <section className="max-w-3xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        Documentation
      </h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
        Platform guidelines for the team. New here? Start with the BigCommerce Developer
        Onboarding curriculum, then set up your environment.
      </p>

      <div className="mt-8 grid gap-4">
        <DocCard
          href="/docs/bigcommerce-developer-onboarding"
          icon={GraduationCap}
          title="BigCommerce Developer Onboarding"
          desc="The full self-serve training path: themes, Handlebars, customization, REST & GraphQL APIs, apps, Catalyst & headless - from first tweak to advanced builds."
        />
        <DocCard
          href="/docs/environment-setup"
          icon={Wrench}
          title="Environment setup"
          desc="Install Node with NVM (Windows and macOS/Linux) and switch between versions."
        />
        <DocCard
          href="/docs/bigcommerce-guidelines"
          icon={ShoppingBag}
          title="BigCommerce guidelines"
          desc="Create API accounts, understand v2 vs v3 access tokens, and set up the Stencil CLI token for theme development."
        />
        <DocCard
          href="/docs/shopify-guidelines"
          icon={Terminal}
          title="Shopify guidelines"
          desc="Install the Shopify CLI and use the pull, preview, and push workflow with our theme versioning convention."
        />
      </div>
    </section>
  );
}

function DocCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof Wrench;
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
