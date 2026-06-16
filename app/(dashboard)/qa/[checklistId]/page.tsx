import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getChecklist, type QaItem } from "@/actions/qa";
import { QaItemRow } from "@/components/qa/QaItemRow";
import { AddQaItemForm } from "@/components/qa/AddQaItemForm";
import { DeleteChecklistButton } from "@/components/qa/DeleteChecklistButton";
import { QA_STATUSES, STATUS_META, emptyCounts } from "@/lib/qa-status";

export const dynamic = "force-dynamic";

// Group items by section, preserving first-seen order.
function groupBySection(items: QaItem[]): { section: string; items: QaItem[] }[] {
  const order: string[] = [];
  const map = new Map<string, QaItem[]>();
  for (const it of items) {
    if (!map.has(it.section)) {
      map.set(it.section, []);
      order.push(it.section);
    }
    map.get(it.section)!.push(it);
  }
  return order.map((section) => ({ section, items: map.get(section)! }));
}

export default async function ChecklistDetailPage({
  params,
}: {
  params: Promise<{ checklistId: string }>;
}) {
  const { checklistId } = await params;
  const checklist = await getChecklist(checklistId);
  if (!checklist) notFound();

  const { items } = checklist;
  const counts = emptyCounts();
  for (const it of items) counts[it.status]++;
  const total = items.length;
  const reviewed = total - counts.pending;
  const pct = total === 0 ? 0 : Math.round((reviewed / total) * 100);

  const groups = groupBySection(items);
  const sections = groups.map((g) => g.section);

  return (
    <div className="space-y-8">
      {/* header */}
      <div>
        <Link
          href="/qa"
          className="inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" /> QA checklists
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {checklist.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {checklist.appName ? `${checklist.appName} · ` : ""}
              {checklist.templateName}
              {checklist.createdAt
                ? ` · created ${new Date(checklist.createdAt).toLocaleDateString()}`
                : ""}
            </p>
          </div>
          <DeleteChecklistButton id={checklist.id} name={checklist.name} />
        </div>
      </div>

      {/* summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {reviewed} of {total} reviewed
          </span>
          <span className="tabular-nums text-gray-500 dark:text-gray-400">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {QA_STATUSES.map((s) => (
            <span
              key={s}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_META[s].badge}`}
            >
              {STATUS_META[s].label} {counts[s]}
            </span>
          ))}
        </div>
      </div>

      {/* sections */}
      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
          This checklist has no items yet. Add your first checkpoint below.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const groupReviewed = group.items.filter((i) => i.status !== "pending").length;
            return (
              <section key={group.section}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {group.section}
                  </h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {groupReviewed}/{group.items.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
                  {group.items.map((item) => (
                    <QaItemRow key={item.id} checklistId={checklist.id} item={item} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* add custom checkpoint */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
          Add a checkpoint
        </h2>
        <AddQaItemForm checklistId={checklist.id} sections={sections} />
      </div>
    </div>
  );
}
