import Link from "next/link";
import { FolderKanban, ClipboardCheck, KeyRound, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your team workspace — projects, QA checklists and a secrets vault.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          href="/projects"
          icon={FolderKanban}
          title="Projects"
          desc="Links & secrets per project"
        />
        <SectionCard
          href="/qa"
          icon={ClipboardCheck}
          title="QA"
          desc="Checklists & app-review runs"
        />
        <SectionCard
          href="/secrets"
          icon={KeyRound}
          title="Secrets"
          desc="Encrypted credentials vault"
        />
      </div>
    </div>
  );
}

function SectionCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof FolderKanban;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/40"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500 dark:text-gray-600 dark:group-hover:text-indigo-400" />
      </div>
      <h3 className="mt-3 font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </Link>
  );
}
