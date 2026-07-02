import { DocsSidebar } from "@/components/public/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[84rem] gap-8 px-5 sm:px-6 lg:gap-12 lg:px-8">
      <DocsSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
