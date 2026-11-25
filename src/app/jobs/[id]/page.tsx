import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftActions } from "@/components/DraftActions";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchJob, fetchJobAudit } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: job, source } = await fetchJob(id);
  if (!job) {
    notFound();
  }

  const audit = await fetchJobAudit(id);
  const portalHref = job.portalToken ? `/p/${job.portalToken}` : null;
  const pending = job.drafts.filter((d) => d.status === "PendingApproval");
  const visiblePhotos = job.photos.filter((p) => p.customerVisible);
  const staffOnlyPhotos = job.photos.filter((p) => !p.customerVisible);

  return (
    <StaffChrome active="detail" source={source} title={job.addressLine1}>
      <div className="mb-3">
        <Link
          href="/jobs"
          className="text-[12px] font-medium text-[var(--console-muted)] hover:text-[var(--console-accent)]"
        >
          ← Jobs
        </Link>
      </div>

      <PageHeader
        title={job.addressLine1}
        description={`${job.city}, ${job.state} ${job.postalCode} · ${job.homeownerName} · ${job.homeownerEmail} · ${job.homeownerPhone}`}
        meta={
          <>
            <span className="console-badge">{job.stage}</span>
            <span className="console-badge">{job.status}</span>
            <span className="console-badge font-mono-data">JN {job.externalJobNimbusId}</span>
            {pending.length > 0 ? (
              <span className="console-badge console-badge-accent">
                {pending.length} digest{pending.length === 1 ? "" : "s"} waiting
              </span>
            ) : null}
          </>
        }
        actions={
          portalHref ? (
            <Link href={portalHref} className="console-btn console-btn-secondary">
              Open portal
            </Link>
          ) : null
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="console-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[var(--console-text)]">Evidence</h2>
            <p className="text-[11px] text-[var(--console-muted)]">
              {visiblePhotos.length} portal · {staffOnlyPhotos.length} staff-only
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {job.photos.map((photo) => (
              <figure key={photo.id} className="overflow-hidden rounded-md border border-[var(--console-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="aspect-[16/10] w-full object-cover"
                />
                <figcaption className="border-t border-[var(--console-border)] bg-[#fafbfc] px-3 py-2 text-[12px] text-[var(--console-muted)]">
                  {photo.caption}
                  <span className="ml-2 font-semibold text-[var(--console-text)]">
                    {photo.customerVisible ? "Customer visible" : "Staff only"}
                  </span>
                </figcaption>
              </figure>
            ))}
            {job.photos.length === 0 ? (
              <p className="text-[13px] text-[var(--console-muted)]">No CompanyCam evidence yet.</p>
            ) : null}
          </div>
        </section>

        <section className="console-panel overflow-hidden">
          <div className="border-b border-[var(--console-border)] bg-[#f8f9fb] px-4 py-2.5">
            <h2 className="text-[13px] font-semibold text-[var(--console-text)]">Message drafts</h2>
          </div>
          <ul className="divide-y divide-[var(--console-border)]">
            {job.drafts.map((draft) => (
              <li key={draft.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                      {draft.channel} · {draft.status}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-[var(--console-text)]">
                      {draft.subject}
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--console-muted)]">{draft.body}</p>
                    <p className="mt-2 font-mono-data text-[11px] text-[var(--console-muted)]">
                      {draft.evidenceSummary}
                    </p>
                  </div>
                  <DraftActions
                    draftId={draft.id}
                    status={draft.status}
                    channel={draft.channel}
                    portalHref={portalHref}
                  />
                </div>
              </li>
            ))}
            {job.drafts.length === 0 ? (
              <li className="px-4 py-8 text-[13px] text-[var(--console-muted)]">No drafts yet.</li>
            ) : null}
          </ul>
        </section>
      </div>

      <section className="console-panel mt-4 overflow-hidden">
        <div className="border-b border-[var(--console-border)] bg-[#f8f9fb] px-4 py-2.5">
          <h2 className="text-[13px] font-semibold text-[var(--console-text)]">Audit trail</h2>
        </div>
        {audit.data.length === 0 ? (
          <p className="px-4 py-6 text-[13px] text-[var(--console-muted)]">
            No audit events yet. Approve / reject / send will appear here.
          </p>
        ) : (
          <table className="console-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Detail</th>
                <th>When (CT)</th>
              </tr>
            </thead>
            <tbody>
              {audit.data.map((event) => (
                <tr key={event.id}>
                  <td>
                    <span className="console-badge console-badge-accent font-mono-data">
                      {event.action}
                    </span>
                  </td>
                  <td className="text-[13px] text-[var(--console-muted)]">{event.detail}</td>
                  <td className="font-mono-data whitespace-nowrap text-[12px] text-[var(--console-muted)]">
                    {new Date(event.createdAt).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </StaffChrome>
  );
}
