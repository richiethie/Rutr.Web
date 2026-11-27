import { EmptyState, ErrorState } from "@/components/ApiState";
import { MilestoneCreate, MilestoneRowActions } from "@/components/MilestoneCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchMilestones } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  const result = await loadApi(() => fetchMilestones());

  if (!result.ok) {
    return (
      <StaffChrome active="milestones">
        <PageHeader
          title="Milestones"
          description="Production markers on jobs — without a full crew calendar."
          actions={<MilestoneCreate />}
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const milestones = result.data;

  return (
    <StaffChrome active="milestones" live>
      <PageHeader
        title="Milestones"
        description="Production markers on jobs — without a full crew calendar."
        meta={<span className="console-badge">{milestones.length} milestones</span>}
        actions={<MilestoneCreate />}
      />

      {milestones.length === 0 ? (
        <EmptyState
          title="No milestones"
          description="Add production markers for a job."
          action={<MilestoneCreate />}
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Order</th>
                <th>Job</th>
                <th>Due (CT)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.id}>
                  <td className="font-semibold">{m.name}</td>
                  <td>
                    <span className="console-badge">{m.status}</span>
                  </td>
                  <td className="font-mono-data text-[12px]">{m.sortOrder}</td>
                  <td className="font-mono-data text-[11px] text-muted-foreground">
                    {m.jobId.slice(0, 8)}
                  </td>
                  <td className="font-mono-data whitespace-nowrap text-[12px] text-muted-foreground">
                    {m.dueAt
                      ? new Date(m.dueAt).toLocaleString("en-US", {
                          timeZone: "America/Chicago",
                        })
                      : "—"}
                  </td>
                  <td>
                    <MilestoneRowActions milestone={m} />
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
