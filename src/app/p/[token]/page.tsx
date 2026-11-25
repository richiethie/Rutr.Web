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

  return (
    <div className="min-h-screen">
      <div
        className="relative min-h-[48vh] bg-cover bg-center sm:min-h-[52vh]"
        style={{
          backgroundImage: portal.photos[0]
            ? `linear-gradient(180deg, rgba(20,18,16,0.35), rgba(20,18,16,0.92)), url(${portal.photos[0].imageUrl})`
            : "linear-gradient(180deg, #2a241e, #141210)",
        }}
      >
        <div className="relative z-10 mx-auto flex min-h-[48vh] max-w-3xl flex-col justify-end px-5 pb-10 pt-8 sm:min-h-[52vh] sm:px-8">
          <p className="fade-up brand-mark text-4xl text-[var(--rutr-chalk)] sm:text-5xl">RUTR</p>
          <p className="fade-up-delay mt-2 text-sm uppercase tracking-[0.16em] text-[var(--rutr-mist)]">
            {portal.organizationName}
          </p>
          <h1 className="fade-up-delay mt-4 text-2xl font-semibold text-[var(--rutr-chalk)] sm:text-3xl">
            {portal.addressLine1}
          </h1>
          <p className="fade-up-delay-2 mt-2 text-[var(--rutr-mist)]">
            {portal.city}, {portal.state} · Hi {portal.homeownerName}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        {source === "sample" ? (
          <p className="mb-6 text-xs tracking-wide text-[var(--rutr-copper-hot)]">
            Sample portal data — live API not reachable in this session.
          </p>
        ) : (
          <p className="mb-6 text-[11px] uppercase tracking-[0.14em] text-[var(--rutr-sage)]">
            Verified updates only · token {token}
          </p>
        )}

        <section className="fade-up mb-8 border-b border-[var(--rutr-line)] pb-8">
          <PortalStageRail stage={portal.stage} />
        </section>

        <section className="fade-up-delay border-b border-[var(--rutr-line)] pb-8">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            Latest update · {portal.stage}
          </p>
          <p className="mt-3 text-xl leading-relaxed text-[var(--rutr-chalk)]">
            {portal.latestUpdate}
          </p>
          <p className="mt-4 text-sm text-[var(--rutr-mist)]">
            Status: {portal.status}. Photos and messages appear here only after your project manager
            approves them.
          </p>
        </section>

        <section className="fade-up-delay-2 pt-8">
          <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            Verified photos
          </h2>
          <div className="space-y-6">
            {portal.photos.map((photo) => (
              <figure key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.imageUrl} alt={photo.caption} className="w-full object-cover" />
                <figcaption className="mt-2 text-sm text-[var(--rutr-mist)]">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
            {portal.photos.length === 0 ? (
              <p className="text-[var(--rutr-mist)]">
                No customer-visible photos yet. Check back after the next approved update.
              </p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
