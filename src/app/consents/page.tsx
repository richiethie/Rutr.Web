import { EmptyState, ErrorState } from "@/components/ApiState";
import { ConsentCreate, ConsentRowActions } from "@/components/ConsentCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchConsents } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function ConsentsPage() {
  const result = await loadApi(() => fetchConsents());

  if (!result.ok) {
    return (
      <StaffChrome active="consents">
        <PageHeader
          title="Consents"
          description="SMS/email consent provenance — TCPA-minded channel records."
          actions={<ConsentCreate />}
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const consents = result.data;

  return (
    <StaffChrome active="consents" live>
      <PageHeader
        title="Consents"
        description="SMS/email consent provenance — TCPA-minded channel records."
        meta={<span className="console-badge">{consents.length} records</span>}
        actions={<ConsentCreate />}
      />

      {consents.length === 0 ? (
        <EmptyState
          title="No consent records"
          description="Create consent for a job channel before first SMS."
          action={<ConsentCreate />}
        />
      ) : (
        <div className="console-panel overflow-hidden">
          <table className="console-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>SMS</th>
                <th>Email</th>
                <th>Stopped</th>
                <th>Updated (CT)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {consents.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono-data text-[11px]">
                    {c.jobId?.slice(0, 8) ?? c.contactId?.slice(0, 8) ?? "—"}
                  </td>
                  <td>
                    <span
                      className={
                        c.smsOptIn
                          ? "console-badge console-badge-success"
                          : "console-badge"
                      }
                    >
                      {c.smsOptIn ? "Opt-in" : "Off"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        c.emailOptIn
                          ? "console-badge console-badge-success"
                          : "console-badge"
                      }
                    >
                      {c.emailOptIn ? "Opt-in" : "Off"}
                    </span>
                  </td>
                  <td>
                    {c.smsStopped ? (
                      <span className="console-badge console-badge-accent">STOP</span>
                    ) : (
                      <span className="text-[12px] text-[var(--muted)]">—</span>
                    )}
                  </td>
                  <td className="font-mono-data whitespace-nowrap text-[12px] text-[var(--muted)]">
                    {new Date(c.updatedAt).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                    })}
                  </td>
                  <td>
                    <ConsentRowActions consent={c} />
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
