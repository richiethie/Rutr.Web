import { PortalShell } from "@/components/PortalShell";
import { PortalStageRail } from "@/components/PortalStageRail";
import { fetchPortal } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { data: portal, source } = await fetchPortal(token);
  const heroPhoto = portal.photos[0];

  return (
    <PortalShell organizationName={portal.organizationName}>
      {source === "sample" ? (
        <p className="mb-4 rounded-[5px] border border-[#f0c9b0] bg-[var(--console-accent-soft)] px-3 py-2 text-[12px] text-[var(--console-accent)]">
          Sample portal data — live API not reachable in this session.
        </p>
      ) : null}

      <section className="console-panel overflow-hidden">
        {heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPhoto.imageUrl}
            alt={heroPhoto.caption}
            className="aspect-[21/9] w-full object-cover sm:aspect-[2.4/1]"
          />
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center bg-[var(--console-bg)] text-[13px] text-[var(--console-muted)] sm:aspect-[2.4/1]">
            No verified photos yet
          </div>
        )}
        <div className="border-t border-[var(--console-border)] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="console-badge">{portal.stage}</span>
            <span className="console-badge">{portal.status}</span>
            <span className="console-badge font-mono-data text-[10px]">token {token}</span>
          </div>
          <h1 className="mt-3 text-[22px] font-semibold tracking-tight text-[var(--console-text)] sm:text-[24px]">
            {portal.addressLine1}
          </h1>
          <p className="mt-1 text-[13px] text-[var(--console-muted)]">
            {portal.city}, {portal.state} · Hi {portal.homeownerName}
          </p>
        </div>
      </section>

      <section className="console-panel mt-4 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
          Project progress
        </p>
        <div className="mt-3">
          <PortalStageRail stage={portal.stage} />
        </div>
      </section>

      <section className="console-panel mt-4 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
          Latest update · {portal.stage}
        </p>
        <p className="mt-2 text-[16px] leading-relaxed text-[var(--console-text)] sm:text-[17px]">
          {portal.latestUpdate}
        </p>
        <p className="mt-3 text-[13px] text-[var(--console-muted)]">
          Status: {portal.status}. Only PM-approved photos and messages show here.
        </p>
      </section>

      <section className="mt-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-[var(--console-text)]">Verified photos</h2>
          <span className="text-[12px] text-[var(--console-muted)]">
            {portal.photos.length} visible
          </span>
        </div>
        {portal.photos.length === 0 ? (
          <div className="console-panel px-4 py-8 text-center text-[13px] text-[var(--console-muted)]">
            No customer-visible photos yet. Check back after the next approved update.
          </div>
        ) : (
          <div className="space-y-3">
            {portal.photos.map((photo) => (
              <figure key={photo.id} className="console-panel overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.imageUrl} alt={photo.caption} className="w-full object-cover" />
                <figcaption className="border-t border-[var(--console-border)] bg-[#fafbfc] px-4 py-2.5 text-[13px] text-[var(--console-muted)]">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}
