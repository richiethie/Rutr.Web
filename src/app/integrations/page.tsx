import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { IntegrationConnect } from "@/components/IntegrationConnect";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { SyncButton } from "@/components/SyncButton";
import {
  fetchApprovals,
  fetchIntegrationConnections,
  fetchIntegrationStatus,
  fetchJobs,
} from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const statusResult = await loadApi(fetchIntegrationStatus);
  const connectionsResult = await loadApi(fetchIntegrationConnections);
  const jobsResult = await loadApi(fetchJobs);
  const approvalsResult = await loadApi(fetchApprovals);

  if (!statusResult.ok) {
    return (
      <StaffChrome active="integrations">
        <PageHeader
          title="Integrations"
          description="Mock JobNimbus + CompanyCam connect / disconnect."
          actions={<SyncButton />}
        />
        <ErrorState error={statusResult.error} />
      </StaffChrome>
    );
  }

  const status = statusResult.data;
  const jobs = jobsResult.ok ? jobsResult.data : [];
  const approvals = approvalsResult.ok ? approvalsResult.data : [];
  const waiting = jobs.reduce((sum, j) => sum + j.pendingApprovals, 0);
  const connections = connectionsResult.ok ? connectionsResult.data : null;

  const fallbackRows = [
    {
      name: "JobNimbus",
      provider: "jobnimbus",
      role: "Jobs, stages, homeowner contacts",
      status: status.jobNimbus,
      detail: status.useMocks
        ? "Mock client upserts Rutters jobs on sync."
        : "Live JobNimbus credentials configured.",
      webhook: "POST /api/v1/webhooks/jobnimbus",
    },
    {
      name: "CompanyCam",
      provider: "companycam",
      role: "Field photo evidence",
      status: status.companyCam,
      detail: "Photos stay staff-only until a PM approves the linked digest.",
      webhook: "POST /api/v1/webhooks/companycam",
    },
    {
      name: "Messaging",
      provider: "messaging",
      role: "Twilio SMS + Resend email digests",
      status: status.messaging,
      detail: "Approve then Send on a draft. Mock sender writes audit events.",
      webhook: "POST /api/v1/webhooks/twilio/sms",
    },
  ];

  return (
    <StaffChrome active="integrations" live>
      <PageHeader
        title="Integrations"
        description="Connect pulls JobNimbus work and CompanyCam evidence into the approval queue. Connect/disconnect is mock-only."
        meta={
          <>
            <span className="console-badge">
              Mode · {status.useMocks ? "mocks on" : "live vendors"}
            </span>
            <span className="console-badge">{jobs.length} jobs</span>
            <Link href="/approvals" className="console-badge console-badge-accent hover:underline">
              {approvals.length} in queue · {waiting} pending
            </Link>
          </>
        }
        actions={<SyncButton />}
      />

      {connections ? (
        connections.length === 0 ? (
          <EmptyState
            title="No integration connections"
            description="API returned an empty connections list."
          />
        ) : (
          <div className="stagger-1 console-panel overflow-hidden">
            <table className="console-table">
              <thead>
                <tr>
                  <th>Integration</th>
                  <th>Status</th>
                  <th>Connected (CT)</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <p className="font-semibold">{c.displayName}</p>
                      <p className="font-mono-data text-[11px] text-muted-foreground">
                        {c.provider}
                      </p>
                    </td>
                    <td>
                      <span
                        className={
                          c.isConnected
                            ? "console-badge console-badge-success"
                            : "console-badge"
                        }
                      >
                        {c.isConnected ? "Connected" : "Disconnected"}
                      </span>
                    </td>
                    <td className="font-mono-data text-[12px] text-muted-foreground">
                      {c.connectedAt
                        ? new Date(c.connectedAt).toLocaleString("en-US", {
                            timeZone: "America/Chicago",
                          })
                        : "—"}
                    </td>
                    <td className="text-right">
                      <IntegrationConnect connection={c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <>
          {!connectionsResult.ok ? (
            <div className="mb-4">
              <ErrorState error={connectionsResult.error} />
              <p className="mt-2 text-[12px] text-muted-foreground">
                Showing legacy status until `/api/v1/integrations/connections` lands.
              </p>
            </div>
          ) : null}
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
                {fallbackRows.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-[12px] text-muted-foreground">{item.role}</p>
                    </td>
                    <td>
                      <span className="console-badge console-badge-accent">{item.status}</span>
                    </td>
                    <td className="max-w-md text-[13px] text-muted-foreground">
                      {item.detail}
                    </td>
                    <td className="font-mono-data text-[11px] text-muted-foreground">
                      {item.webhook}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </StaffChrome>
  );
}
