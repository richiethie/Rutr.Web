import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { DraftActions } from "@/components/DraftActions";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { StatCards } from "@/components/StatCards";
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
  const withPortalLink = withPortal.filter((i) => i.portalToken).length;

  return (
    <StaffChrome active="approvals" live>
      <PageHeader
        title="Approvals"
        description="Digests wait here until a PM verifies evidence. Approve → send marks audit and unlocks portal updates."
      />

      <StatCards
        items={[
          {
            label: "In queue",
            value: withPortal.length,
            hint: "Pending + ready to send",
          },
          {
            label: "Pending review",
            value: pendingCount,
            hint: pendingCount ? "Needs approve" : "Nothing waiting",
            trend: pendingCount ? "Review" : "Clear",
            tone: pendingCount ? "warn" : "ok",
          },
          {
            label: "Ready to send",
            value: readyCount,
            hint: "Approved digests",
            trend: readyCount ? "Send" : undefined,
            tone: readyCount ? "brand" : "default",
          },
          {
            label: "Portal linked",
            value: withPortalLink,
            hint: "Jobs with homeowner token",
            tone: "ok",
          },
        ]}
      />

      {withPortal.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          description="Run a mock sync from Integrations or create a draft on a job."
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <div className="overflow-x-auto">
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
                        className="font-medium tracking-tight text-foreground transition-colors hover:text-brand"
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
                      <p className="font-medium">{item.subject}</p>
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
                              ? "size-1.5 rounded-full bg-ok"
                              : "size-1.5 rounded-full bg-warn"
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
        </div>
      )}
    </StaffChrome>
  );
}
