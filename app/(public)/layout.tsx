import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";

export const metadata: Metadata = {
  title: "Codinative Developers",
  description: "Engineering docs, platform guidelines, and a map of Codinative's projects.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-gray-500 sm:flex-row dark:text-gray-400">
          <p>© Codinative - internal developer portal.</p>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="transition hover:text-gray-900 dark:hover:text-white">
              Docs
            </Link>
            <Link href="/login" className="transition hover:text-gray-900 dark:hover:text-white">
              Team sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
