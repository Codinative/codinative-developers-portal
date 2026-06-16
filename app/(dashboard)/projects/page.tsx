import { listProjects } from "@/actions/project-hub";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { NewProjectForm } from "@/components/projects/NewProjectForm";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Projects</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          A hub for every project — open one to keep its links and secrets in
          one place, so the whole team knows where everything lives.
        </p>
      </div>

      <NewProjectForm />

      <div>
        <h2 className="mb-3 text-base font-medium text-gray-900 dark:text-gray-100">
          All projects{projects.length ? ` (${projects.length})` : ""}
        </h2>

        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
            No projects yet. Create one above to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
