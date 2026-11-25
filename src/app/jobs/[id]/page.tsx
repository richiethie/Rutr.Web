import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffChrome } from "@/components/StaffChrome";
import { ApproveButton } from "@/components/ApproveButton";
import { fetchJob } from "@/lib/api";

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
        <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--rutr-mist)]">
          <span className="border border-[var(--rutr-line)] px-2 py-1">{job.stage}</span>
          <span className="border border-[var(--rutr-line)] px-2 py-1">{job.status}</span>
          <span>JN {job.externalJobNimbusId}</span>
          {job.portalToken ? (
            <Link
              href={`/p/${job.portalToken}`}
              className="text-[var(--rutr-copper-hot)] hover:underline"
            >
              Portal /p/{job.portalToken}
            </Link>
          ) : null}
        </div>
      </div>

      <section className="fade-up-delay mb-12">
        <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
          Evidence
        </h2>
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
                  {photo.customerVisible ? "Customer visible" : "Staff only"}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="fade-up-delay-2">
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
                {draft.status === "PendingApproval" ? (
                  <ApproveButton draftId={draft.id} />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </StaffChrome>
  );
}
