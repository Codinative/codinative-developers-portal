import { DocsSidebar } from "@/components/public/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[90rem] px-5 sm:px-6 lg:px-8">
      <DocsSidebar />
      <main className="min-w-0 flex-1 lg:px-10 xl:px-16">{children}</main>
    </div>
  );
}
