import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ApiState";
import { EvidenceActions } from "@/components/EvidenceCrud";
import { PageHeader, StaffChrome } from "@/components/StaffChrome";
import { fetchEvidence } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function EvidencePage() {
  const result = await loadApi(() => fetchEvidence());

  if (!result.ok) {
    return (
      <StaffChrome active="evidence">
        <PageHeader
          title="Evidence"
          description="Photo metadata, portal visibility, and soft-delete."
        />
        <ErrorState error={result.error} />
      </StaffChrome>
    );
  }

  const items = result.data.filter((e) => !e.softDeleted);

  return (
    <StaffChrome active="evidence" live>
      <PageHeader
        title="Evidence"
        description="Photo metadata from mock ingest / manual create. Toggle portal visibility or soft-delete."
        meta={<span className="console-badge">{items.length} photos</span>}
      />

      {items.length === 0 ? (
        <EmptyState
          title="No evidence"
          description="Add photos from a job detail page or run mock CompanyCam sync."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((photo) => (
            <figure key={photo.id} className="console-panel overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="aspect-[16/10] w-full object-cover"
              />
              <figcaption className="border-t border-[var(--line)] px-3 py-2.5 text-[12px] text-muted-foreground">
                <p className="font-semibold text-[var(--text)]">{photo.caption}</p>
                <p className="mt-1">
                  <Link href={`/jobs/${photo.jobId}`} className="hover:text-[var(--signal)]">
                    Job {photo.jobId.slice(0, 8)}
                  </Link>
                  {" · "}
                  {photo.customerVisible ? "Portal visible" : "Staff only"}
                </p>
                <EvidenceActions
                  jobId={photo.jobId}
                  photo={{
                    id: photo.id,
                    caption: photo.caption,
                    imageUrl: photo.imageUrl,
                    customerVisible: photo.customerVisible,
                    capturedAt: photo.capturedAt,
                  }}
                />
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </StaffChrome>
  );
}
