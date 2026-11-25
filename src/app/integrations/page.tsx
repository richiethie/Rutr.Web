import Link from "next/link";
import { StaffChrome } from "@/components/StaffChrome";
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
        ? "Mock client upserts Rutters jobs on sync. Webhook: POST /api/v1/webhooks/jobnimbus"
        : "Live JobNimbus credentials configured.",
    },
    {
      name: "CompanyCam",
      role: "Field photo evidence",
      status: status.companyCam,
      detail:
        "Photos stay staff-only until a PM approves the linked digest. Webhook: POST /api/v1/webhooks/companycam",
    },
    {
      name: "Messaging",
      role: "Twilio SMS + Resend email digests",
      status: status.messaging,
      detail:
        "Approve then Send on a draft. Mock sender writes audit events. STOP: POST /api/v1/webhooks/twilio/sms",
    },
  ];

  return (
    <StaffChrome active="integrations" source={source}>
      <div className="fade-up mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--rutr-chalk)]">Integrations</h1>
          <p className="mt-2 max-w-2xl text-[var(--rutr-mist)]">
            Connect pulls JobNimbus work and CompanyCam evidence into the approval queue. Run mock
            sync to refresh local pilot data.
          </p>
        </div>
        <SyncButton />
      </div>

      <div className="fade-up-delay mb-8 flex flex-wrap gap-4 text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
        <span className="border border-[var(--rutr-line)] px-3 py-1.5">
          Mode · {status.useMocks ? "mocks on" : "live vendors"}
        </span>
        <span className="border border-[var(--rutr-line)] px-3 py-1.5">
          {jobs.data.length} jobs
        </span>
        <Link
          href="/approvals"
          className="border border-[var(--rutr-copper)]/40 px-3 py-1.5 text-[var(--rutr-copper-hot)] hover:bg-[rgba(197,106,45,0.08)]"
        >
          {approvals.data.length} in queue · {waiting} pending flags
        </Link>
      </div>

      <ul className="fade-up-delay-2 divide-y divide-[var(--rutr-line)] border-y border-[var(--rutr-line)]">
        {rows.map((item) => (
          <li
            key={item.name}
            className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="max-w-xl">
              <p className="text-lg text-[var(--rutr-chalk)]">{item.name}</p>
              <p className="mt-1 text-sm text-[var(--rutr-mist)]">{item.role}</p>
              <p className="mt-3 text-sm text-[var(--rutr-sage)]">{item.detail}</p>
            </div>
            <span className="self-start rounded-sm border border-[var(--rutr-copper)]/50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--rutr-copper-hot)]">
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </StaffChrome>
  );
}
