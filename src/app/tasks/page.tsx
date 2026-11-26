import { EmptyState, ErrorState } from "@/components/ApiState";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { TaskCreate, TaskRowActions } from "@/components/TaskCrud";
import { fetchTasks } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const result = await loadApi(() => fetchTasks());

  if (!result.ok) {
    return (
      <StaffChrome active="tasks">
        <PageHeader
          title="Tasks"
          description="Follow-ups tied to jobs."
          actions={<TaskCreate />}
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const tasks = result.data;

  return (
    <StaffChrome active="tasks" live>
      <PageHeader
        title="Tasks"
        description="Follow-ups tied to jobs."
        meta={<span className="console-badge">{tasks.length} tasks</span>}
        actions={<TaskCreate />}
      />

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks"
          description="Create a follow-up for a job."
          action={<TaskCreate />}
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Job</th>
                <th>Due (CT)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <p className="font-semibold">{t.title}</p>
                    {t.description ? (
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{t.description}</p>
                    ) : null}
                  </td>
                  <td>
                    <span className="console-badge">{t.status}</span>
                  </td>
                  <td className="font-mono-data text-[11px] text-muted-foreground">
                    {t.jobId?.slice(0, 8) ?? t.contactId?.slice(0, 8) ?? "—"}
                  </td>
                  <td className="font-mono-data whitespace-nowrap text-[12px] text-muted-foreground">
                    {t.dueAt
                      ? new Date(t.dueAt).toLocaleString("en-US", {
                          timeZone: "America/Chicago",
                        })
                      : "—"}
                  </td>
                  <td>
                    <TaskRowActions task={t} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StaffChrome>
  );
}
