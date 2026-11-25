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
        className="relative min-h-[52vh] bg-cover bg-center"
        style={{
          backgroundImage: portal.photos[0]
            ? `linear-gradient(180deg, rgba(20,18,16,0.35), rgba(20,18,16,0.92)), url(${portal.photos[0].imageUrl})`
            : "linear-gradient(180deg, #2a241e, #141210)",
        }}
      >
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-3xl flex-col justify-end px-5 pb-10 pt-8 sm:px-8">
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

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {source === "sample" ? (
          <p className="mb-6 text-xs tracking-wide text-[var(--rutr-copper-hot)]">
            Sample portal data — live API not reachable in this session.
          </p>
        ) : null}

        <section className="fade-up border-b border-[var(--rutr-line)] pb-8">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            Current stage · {portal.stage}
          </p>
          <p className="mt-3 text-xl leading-relaxed text-[var(--rutr-chalk)]">
            {portal.latestUpdate}
          </p>
          <p className="mt-4 text-sm text-[var(--rutr-mist)]">
            Status: {portal.status}. Only PM-approved photos and updates appear here.
          </p>
        </section>

        <section className="fade-up-delay pt-8">
          <h2 className="mb-4 text-sm uppercase tracking-[0.16em] text-[var(--rutr-sage)]">
            Verified photos
          </h2>
          <div className="space-y-6">
            {portal.photos.map((photo) => (
              <figure key={photo.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full object-cover"
                />
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
