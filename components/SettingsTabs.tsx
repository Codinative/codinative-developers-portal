import Link from "next/link";

export function SettingsTabs({
  active,
  isOwner,
}: {
  active: "account" | "team";
  isOwner: boolean;
}) {
  const tabs = [
    { href: "/settings", key: "account" as const, label: "Account" },
    ...(isOwner ? [{ href: "/settings/team", key: "team" as const, label: "Team" }] : []),
  ];

  return (
    <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
            active === tab.key
              ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
