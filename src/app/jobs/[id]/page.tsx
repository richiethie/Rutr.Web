import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftActions } from "@/components/DraftActions";
import { StaffChrome } from "@/components/StaffChrome";
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
    <StaffChrome active="detail" source={source}>
      <div className="fade-up mb-8">
        <Link
          href="/jobs"
          className="text-xs uppercase tracking-[0.16em] text-[var(--rutr-mist)] hover:text-[var(--rutr-chalk)]"
        >
          ← All jobs
        </Link>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--rutr-chalk)] sm:text-4xl">
          {job.addressLine1}
        </h1>
        <p className="mt-2 text-[var(--rutr-mist)]">
          {job.city}, {job.state} {job.postalCode} · {job.homeownerName}
        </p>
        <p className="mt-1 text-sm text-[var(--rutr-sage)]">
          {job.homeownerEmail} · {job.homeownerPhone}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
          <span className="border border-[var(--rutr-line)] px-2 py-1">{job.stage}</span>
          <span className="border border-[var(--rutr-line)] px-2 py-1">{job.status}</span>
          <span>JN {job.externalJobNimbusId}</span>
          {portalHref ? (
            <Link href={portalHref} className="text-[var(--rutr-copper-hot)] hover:underline">
              Homeowner portal
            </Link>
          ) : null}
        </div>
      </div>

      {pending.length > 0 ? (
        <section className="fade-up-delay mb-10 border border-[var(--rutr-copper)]/40 bg-[rgba(197,106,45,0.08)] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--rutr-copper-hot)]">
            Connect queue · {pending.length} digest{pending.length === 1 ? "" : "s"} waiting
          </p>
          <p className="mt-2 text-sm text-[var(--rutr-mist)]">
            Approve only after you verify evidence, then send the mock digest. Portal photos stay
            staff-only until approval.
          </p>
        </section>
      ) : null}

      <section className="fade-up-delay mb-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">Evidence</h2>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--rutr-mist)]">
            {visiblePhotos.length} portal · {staffOnlyPhotos.length} staff-only
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {job.photos.map((photo) => (
            <figure key={photo.id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="aspect-[16/10] w-full object-cover"
              />
              <figcaption className="mt-2 text-sm text-[var(--rutr-mist)]">
                {photo.caption}
                <span className="ml-2 text-xs uppercase tracking-wider text-[var(--rutr-sage)]">
                  {photo.customerVisible ? "Customer visible" : "Staff only — pending approval"}
                </span>
              </figcaption>
            </figure>
          ))}
          {job.photos.length === 0 ? (
            <p className="text-[var(--rutr-mist)]">No CompanyCam evidence yet.</p>
          ) : null}
        </div>
      </section>

      <section className="fade-up-delay-2 mb-12">
        <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
          Message drafts
        </h2>
        <ul className="space-y-6">
          {job.drafts.map((draft) => (
            <li key={draft.id} className="border-t border-[var(--rutr-line)] pt-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
                    {draft.channel} · {draft.status}
                  </p>
                  <p className="mt-1 text-lg text-[var(--rutr-chalk)]">{draft.subject}</p>
                  <p className="mt-2 text-[var(--rutr-mist)]">{draft.body}</p>
                  <p className="mt-2 text-xs text-[var(--rutr-sage)]">{draft.evidenceSummary}</p>
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
            <li className="text-[var(--rutr-mist)]">No drafts for this job yet.</li>
          ) : null}
        </ul>
      </section>

      <section className="fade-up-delay-2">
        <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
          Audit trail
        </h2>
        {audit.data.length === 0 ? (
          <p className="border-y border-[var(--rutr-line)] py-6 text-sm text-[var(--rutr-mist)]">
            No audit events yet. Approve / reject / send will appear here.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--rutr-line)] border-y border-[var(--rutr-line)]">
            {audit.data.map((event) => (
              <li key={event.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.12em] text-[var(--rutr-copper-hot)]">
                    {event.action}
                  </p>
                  <p className="mt-1 text-sm text-[var(--rutr-mist)]">{event.detail}</p>
                </div>
                <p className="text-xs text-[var(--rutr-sage)]">
                  {new Date(event.createdAt).toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                  })}{" "}
                  CT
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </StaffChrome>
  );
}
