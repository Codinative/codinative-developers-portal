import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen md:pl-64">
      <Sidebar email={session?.user?.email} />
      <main className="mx-auto max-w-6xl px-6 pb-10 pt-6">{children}</main>
    </div>
  );
}
