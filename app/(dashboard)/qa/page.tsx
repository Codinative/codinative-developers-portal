import { listChecklists } from "@/actions/qa";
import { ChecklistCard } from "@/components/qa/ChecklistCard";
import { NewChecklistForm } from "@/components/qa/NewChecklistForm";

export const dynamic = "force-dynamic";

export default async function QaPage() {
  const checklists = await listChecklists();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">QA checklists</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track app-review and QA criteria before submitting an app. Start from
          the BigCommerce Marketplace App Review template, or build your own.
        </p>
      </div>

      <NewChecklistForm />

      <div>
        <h2 className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
          Checklists{checklists.length ? ` (${checklists.length})` : ""}
        </h2>

        {checklists.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
            No checklists yet. Create one above to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {checklists.map((c) => (
              <ChecklistCard key={c.id} checklist={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
