import { ErrorState } from "@/components/ApiState";
import { PortalShell } from "@/components/PortalShell";
import { PortalStageRail } from "@/components/PortalStageRail";
import { fetchPortal } from "@/lib/api";
import { loadApi } from "@/lib/api/load";

export const dynamic = "force-dynamic";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await loadApi(() => fetchPortal(token));

  if (!result.ok) {
    return (
      <PortalShell organizationName="RUTR">
        <ErrorState error={result.error} />
      </PortalShell>
    );
  }

  const portal = result.data;
  const photos = portal.photos ?? [];
  const milestones = portal.milestones ?? [];
  const heroPhoto = photos[0];

  return (
    <PortalShell organizationName={portal.organizationName}>
      <section className="overflow-hidden rounded-lg border border-border bg-card">
        {heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPhoto.imageUrl}
            alt={heroPhoto.caption}
            className="aspect-[21/9] w-full object-cover sm:aspect-[2.4/1]"
          />
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center bg-muted text-[13px] text-muted-foreground sm:aspect-[2.4/1]">
            No verified photos yet
          </div>
        )}
        <div className="border-t border-border px-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="console-badge">{portal.stage}</span>
            <span className="console-badge">{portal.status}</span>
          </div>
          <h1 className="display-title mt-3 text-[26px] text-foreground sm:text-[28px]">
            {portal.addressLine1}
          </h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            {portal.city}, {portal.state} · Hi {portal.homeownerName}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-border bg-card p-5">
        <p className="text-[12px] font-medium text-muted-foreground">Project progress</p>
        <div className="mt-3">
          <PortalStageRail stage={portal.stage} />
        </div>
      </section>

      {milestones.length > 0 ? (
        <section className="mt-4 rounded-lg border border-border bg-card p-5">
          <p className="text-[12px] font-medium text-muted-foreground">Milestones</p>
          <ul className="mt-3 space-y-2">
            {milestones.map((m, i) => (
              <li
                key={`${m.name}-${i}`}
                className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <span className="text-[14px] font-medium text-foreground">{m.name}</span>
                <span className="console-badge">{m.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-4 rounded-lg border border-border bg-card p-5">
        <p className="text-[12px] font-medium text-muted-foreground">
          Latest update · {portal.stage}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground">{portal.latestUpdate}</p>
        <p className="mt-3 text-[13px] text-muted-foreground">
          Status: {portal.status}. Only PM-approved photos and messages show here.
        </p>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-[15px] font-medium text-foreground">Verified photos</h2>
          <span className="text-[12px] text-muted-foreground">{photos.length} visible</span>
        </div>
        {photos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-[13px] text-muted-foreground">
            No customer-visible photos yet. Check back after the next approved update.
          </div>
        ) : (
          <div className="space-y-3">
            {photos.map((photo) => (
              <figure key={photo.id} className="overflow-hidden rounded-lg border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.imageUrl} alt={photo.caption} className="w-full object-cover" />
                <figcaption className="border-t border-border px-4 py-3 text-[13px] text-muted-foreground">
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
