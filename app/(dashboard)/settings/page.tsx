import { auth } from "@/lib/auth";
import { getAccountInfo, getMyAccountInfo } from "@/actions/account";
import { AccountSettingsForm } from "@/components/AccountSettingsForm";
import { MemberAccountForm } from "@/components/MemberAccountForm";
import { SettingsTabs } from "@/components/SettingsTabs";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  const isOwner = session?.user?.role === "owner";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your own login here. Team logins live under the Team tab.
        </p>
      </div>

      <SettingsTabs active="account" isOwner={isOwner} />

      <section className="space-y-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">Your login</h2>
        {isOwner ? (
          <OwnerAccountSection />
        ) : (
          <MemberAccountSection />
        )}
      </section>
    </div>
  );
}

async function OwnerAccountSection() {
  const account = await getAccountInfo();
  return <AccountSettingsForm currentEmail={account.email} source={account.source} />;
}

async function MemberAccountSection() {
  const account = await getMyAccountInfo();
  return <MemberAccountForm email={account.email} />;
}
