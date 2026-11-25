import Link from "next/link";
import { DraftActions } from "@/components/DraftActions";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchApprovals, fetchJob } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const { data: items, source } = await fetchApprovals();

  const withPortal = await Promise.all(
    items.map(async (item) => {
      const job = await fetchJob(item.jobId);
      return {
        ...item,
        portalToken: job.data?.portalToken ?? null,
      };
    }),
  );

  return (
    <StaffChrome active="approvals" source={source}>
      <PageHeader
        title="Approvals"
        description="Digests wait here until a PM verifies evidence. Approve → send marks audit and unlocks portal updates."
        meta={
          <span className={withPortal.length ? "console-badge console-badge-accent" : "console-badge console-badge-success"}>
            {withPortal.length} in queue
          </span>
        }
      />

      <div className="stagger-1 console-panel overflow-hidden">
        {withPortal.length === 0 ? (
          <p className="px-4 py-12 text-center text-[13px] text-[var(--console-muted)]">
            Queue is clear. Run a mock sync from Integrations or wait for CompanyCam activity.
          </p>
        ) : (
          <table className="console-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Channel</th>
                <th>Digest</th>
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
                      className="font-semibold tracking-tight transition-colors hover:text-[var(--console-accent)]"
                    >
                      {item.addressLine1}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-[var(--console-muted)]">
                      {item.homeownerName}
                    </p>
                  </td>
                  <td>
                    <span className="console-badge">{item.channel}</span>
                  </td>
                  <td className="max-w-md">
                    <p className="text-[13px] font-semibold">{item.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-[12px] text-[var(--console-muted)]">
                      {item.body}
                    </p>
                  </td>
                  <td className="font-mono-data max-w-[12rem] text-[11px] text-[var(--console-muted)]">
                    {item.evidenceSummary}
                  </td>
                  <td className="text-right">
                    <DraftActions
                      draftId={item.draftId}
                      status="PendingApproval"
                      channel={item.channel}
                      portalHref={item.portalToken ? `/p/${item.portalToken}` : null}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </StaffChrome>
  );
}
