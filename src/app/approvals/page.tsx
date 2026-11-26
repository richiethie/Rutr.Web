import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { DraftActions } from "@/components/DraftActions";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchApprovals, fetchJob } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const result = await loadApi(fetchApprovals);

  if (!result.ok) {
    return (
      <StaffChrome active="approvals">
        <PageHeader
          title="Approvals"
          description="Digests wait here until a PM verifies evidence."
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const items = result.data;
  const withPortal = await Promise.all(
    items.map(async (item) => {
      const job = await loadApi(() => fetchJob(item.jobId));
      return {
        ...item,
        status: item.status || "PendingApproval",
        portalToken: job.ok ? job.data.portalToken : null,
      };
    }),
  );

  const pendingCount = withPortal.filter((i) => i.status === "PendingApproval").length;
  const readyCount = withPortal.filter((i) => i.status === "Approved").length;

  return (
    <StaffChrome active="approvals" live>
      <PageHeader
        title="Approvals"
        description="Digests wait here until a PM verifies evidence. Approve → send marks audit and unlocks portal updates."
        meta={
          <>
            <span
              className={
                pendingCount
                  ? "console-badge console-badge-warn"
                  : "console-badge console-badge-success"
              }
            >
              <span
                className={
                  pendingCount
                    ? "h-1.5 w-1.5 rounded-full bg-warn"
                    : "h-1.5 w-1.5 rounded-full bg-ok"
                }
              />
              {pendingCount} pending
            </span>
            {readyCount > 0 ? (
              <span className="console-badge console-badge-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {readyCount} ready to send
              </span>
            ) : null}
          </>
        }
      />

      {withPortal.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          description="Run a mock sync from Integrations or create a draft on a job."
        />
      ) : (
        <div className="stagger-1 console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Channel</th>
                <th>Digest</th>
                <th>Status</th>
                <th>Evidence</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withPortal.map((item) => (
                <tr key={item.draftId}>
                  <td>
                    <Link
                      href={`/jobs/${item.jobId}`}
                      className="font-semibold tracking-tight transition-colors hover:text-foreground"
                    >
                      {item.addressLine1}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {item.homeownerName}
                    </p>
                  </td>
                  <td>
                    <span className="console-badge">{item.channel}</span>
                  </td>
                  <td className="max-w-md">
                    <p className="text-[13px] font-semibold">{item.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">
                      {item.body}
                    </p>
                  </td>
                  <td>
                    <span
                      className={
                        item.status === "Approved"
                          ? "console-badge console-badge-success"
                          : "console-badge console-badge-warn"
                      }
                    >
                      <span
                        className={
                          item.status === "Approved"
                            ? "h-1.5 w-1.5 rounded-full bg-ok"
                            : "h-1.5 w-1.5 rounded-full bg-warn"
                        }
                      />
                      {item.status === "Approved" ? "Ready to send" : "Pending"}
                    </span>
                  </td>
                  <td className="font-mono-data max-w-[12rem] text-[11px] text-muted-foreground">
                    {item.evidenceSummary}
                  </td>
                  <td className="text-right">
                    <DraftActions
                      draftId={item.draftId}
                      status={item.status}
                      channel={item.channel}
                      portalHref={item.portalToken ? `/p/${item.portalToken}` : null}
                    />
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
