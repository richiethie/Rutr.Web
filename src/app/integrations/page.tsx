import Link from "next/link";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { SyncButton } from "@/components/SyncButton";
import { fetchApprovals, fetchIntegrationStatus, fetchJobs } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const { data: status, source } = await fetchIntegrationStatus();
  const jobs = await fetchJobs();
  const approvals = await fetchApprovals();
  const waiting = jobs.data.reduce((sum, j) => sum + j.pendingApprovals, 0);

  const rows = [
    {
      name: "JobNimbus",
      role: "Jobs, stages, homeowner contacts",
      status: status.jobNimbus,
      detail: status.useMocks
        ? "Mock client upserts Rutters jobs on sync."
        : "Live JobNimbus credentials configured.",
      webhook: "POST /api/v1/webhooks/jobnimbus",
    },
    {
      name: "CompanyCam",
      role: "Field photo evidence",
      status: status.companyCam,
      detail: "Photos stay staff-only until a PM approves the linked digest.",
      webhook: "POST /api/v1/webhooks/companycam",
    },
    {
      name: "Messaging",
      role: "Twilio SMS + Resend email digests",
      status: status.messaging,
      detail: "Approve then Send on a draft. Mock sender writes audit events.",
      webhook: "POST /api/v1/webhooks/twilio/sms",
    },
  ];

  return (
    <StaffChrome active="integrations" source={source}>
      <PageHeader
        title="Integrations"
        description="Connect pulls JobNimbus work and CompanyCam evidence into the approval queue."
        meta={
          <>
            <span className="console-badge">
              Mode · {status.useMocks ? "mocks on" : "live vendors"}
            </span>
            <span className="console-badge">{jobs.data.length} jobs</span>
            <Link href="/approvals" className="console-badge console-badge-accent hover:underline">
              {approvals.data.length} in queue · {waiting} pending
            </Link>
          </>
        }
        actions={<SyncButton />}
      />

      <div className="stagger-1 console-panel overflow-hidden">
        <table className="console-table">
          <thead>
            <tr>
              <th>Integration</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Webhook</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.name}>
                <td>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-[12px] text-[var(--console-muted)]">{item.role}</p>
                </td>
                <td>
                  <span className="console-badge console-badge-accent">{item.status}</span>
                </td>
                <td className="max-w-md text-[13px] text-[var(--console-muted)]">{item.detail}</td>
                <td className="font-mono-data text-[11px] text-[var(--console-muted)]">
                  {item.webhook}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffChrome>
  );
}
