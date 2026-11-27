import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { DetailFields } from "@/components/DetailFields";
import { DraftActions } from "@/components/DraftActions";
import { DraftCreate, DraftEdit } from "@/components/DraftCrud";
import { EvidenceActions, EvidenceCreate } from "@/components/EvidenceCrud";
import { JobEdit } from "@/components/JobCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchJob, fetchJobAudit } from "@/lib/api";
import { isNotFound } from "@/lib/api/errors";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await loadApi(() => fetchJob(id));

  if (!result.ok) {
    return (
      <StaffChrome active="detail" title="Job">
        <div className="mb-3">
          <Link
            href="/jobs"
            className="text-[12px] font-semibold text-muted-foreground hover:text-[var(--signal)]"
          >
            ← Jobs
          </Link>
        </div>
        {isNotFound(result.error) ? (
          <EmptyState title="Job not found" description="This id is not in the API." />
        ) : (
          <ErrorState error={result.error} />
        )}
      </StaffChrome>
    );
  }

  const job = result.data;
  const photos = job.photos ?? [];
  const drafts = job.drafts ?? [];
  const auditResult = await loadApi(() => fetchJobAudit(id));
  const audit = auditResult.ok ? auditResult.data : [];
  const portalHref = job.portalToken ? `/p/${job.portalToken}` : null;
  const pending = drafts.filter((d) => d.status === "PendingApproval");
  const visiblePhotos = photos.filter((p) => p.customerVisible);
  const staffOnlyPhotos = photos.filter((p) => !p.customerVisible);

  return (
    <StaffChrome active="detail" live title={job.addressLine1}>
      <div className="mb-3">
        <Link
          href="/jobs"
          className="text-[12px] font-semibold text-muted-foreground transition-colors hover:text-[var(--console-accent)]"
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
            {job.jobType ? <span className="console-badge">{job.jobType}</span> : null}
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

      <div className="mb-4">
        <DetailFields
          title="Job details"
          actions={<JobEdit job={job} />}
          fields={[
            { label: "Title", value: job.title },
            { label: "Address", value: job.addressLine1 },
            { label: "City", value: `${job.city}, ${job.state} ${job.postalCode}` },
            { label: "Homeowner", value: job.homeownerName },
            { label: "Email", value: job.homeownerEmail },
            { label: "Phone", value: job.homeownerPhone },
            { label: "Status", value: job.status },
            { label: "Stage", value: job.stage },
            { label: "Type", value: job.jobType },
            { label: "JobNimbus id", value: job.externalJobNimbusId },
          ]}
        />
      </div>

      <div className="stagger-1 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="console-panel p-5">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="display-title text-[15px] font-semibold text-[var(--console-text)]">
              Evidence
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-medium text-muted-foreground">
                {visiblePhotos.length} portal · {staffOnlyPhotos.length} staff-only
              </p>
              <EvidenceCreate jobId={job.id} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="photo-lift overflow-hidden rounded-[var(--console-radius-sm)] border border-[var(--console-border)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="aspect-[16/10] w-full object-cover"
                />
                <figcaption className="border-t border-[var(--console-border)] bg-gradient-to-b from-[#fafbfd] to-white px-3 py-2.5 text-[12px] text-muted-foreground">
                  {photo.caption}
                  <span className="ml-2 font-semibold text-[var(--console-text)]">
                    {photo.customerVisible ? "Customer visible" : "Staff only"}
                  </span>
                  <EvidenceActions jobId={job.id} photo={photo} />
                </figcaption>
              </figure>
            ))}
            {photos.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No evidence yet.</p>
            ) : null}
          </div>
        </section>

        <section className="console-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--console-border)] bg-gradient-to-b from-[#fafbfd] to-[#f4f6fa] px-4 py-3">
            <h2 className="display-title text-[15px] font-semibold text-[var(--console-text)]">
              Message drafts
            </h2>
            <DraftCreate jobId={job.id} />
          </div>
          <ul className="divide-y divide-[var(--console-border)]">
            {drafts.map((draft) => (
              <li key={draft.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {draft.channel} · {draft.status}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-[var(--console-text)]">
                      {draft.subject}
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{draft.body}</p>
                    <p className="mt-2 font-mono-data text-[11px] text-muted-foreground">
                      {draft.evidenceSummary}
                    </p>
                    <div className="mt-2">
                      <DraftEdit jobId={job.id} draft={draft} />
                    </div>
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
            {drafts.length === 0 ? (
              <li className="px-4 py-8 text-[13px] text-muted-foreground">No drafts yet.</li>
            ) : null}
          </ul>
        </section>
      </div>

      <section className="stagger-2 console-panel mt-4 overflow-hidden">
        <div className="border-b border-[var(--console-border)] bg-gradient-to-b from-[#fafbfd] to-[#f4f6fa] px-4 py-3">
          <h2 className="display-title text-[15px] font-semibold text-[var(--console-text)]">
            Audit trail
          </h2>
        </div>
        {!auditResult.ok ? (
          <div className="p-4">
            <ErrorState error={auditResult.error} />
          </div>
        ) : audit.length === 0 ? (
          <p className="px-4 py-6 text-[13px] text-muted-foreground">
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
              {audit.map((event) => (
                <tr key={event.id}>
                  <td>
                    <span className="console-badge console-badge-accent font-mono-data">
                      {event.action}
                    </span>
                  </td>
                  <td className="text-[13px] text-muted-foreground">{event.detail}</td>
                  <td className="font-mono-data whitespace-nowrap text-[12px] text-muted-foreground">
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
