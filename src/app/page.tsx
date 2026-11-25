import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(20,18,16,0.92) 18%, rgba(20,18,16,0.55) 55%, rgba(20,18,16,0.35)), url(https://images.unsplash.com/photo-1632759145351-1d592919f540?w=1800&q=80)",
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-5 pb-16 pt-10 sm:px-8 sm:pb-20">
        <p className="fade-up brand-mark text-5xl text-[var(--rutr-chalk)] sm:text-7xl md:text-8xl">
          RUTR
        </p>
        <h1 className="fade-up-delay mt-4 max-w-xl text-2xl font-semibold leading-tight text-[var(--rutr-chalk)] sm:text-3xl">
          Field evidence in. Homeowner clarity out.
        </h1>
        <p className="fade-up-delay-2 mt-4 max-w-lg text-base text-[var(--rutr-mist)] sm:text-lg">
          Connect stitches JobNimbus jobs and CompanyCam photos into digests your PMs approve before
          anything reaches the portal.
        </p>
        <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-sm bg-[var(--rutr-copper)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--rutr-ink)] hover:bg-[var(--rutr-copper-hot)]"
          >
            Staff login
          </Link>
          <Link
            href="/jobs"
            className="rounded-sm border border-[var(--rutr-line)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--rutr-chalk)] hover:border-[var(--rutr-copper)]"
          >
            Open jobs
          </Link>
          <Link
            href="/approvals"
            className="rounded-sm px-5 py-3 text-sm uppercase tracking-[0.14em] text-[var(--rutr-mist)] underline-offset-4 hover:text-[var(--rutr-chalk)] hover:underline"
          >
            Approvals queue
          </Link>
          <Link
            href="/p/keller-maple-demo"
            className="rounded-sm px-5 py-3 text-sm uppercase tracking-[0.14em] text-[var(--rutr-mist)] underline-offset-4 hover:text-[var(--rutr-chalk)] hover:underline"
          >
            Sample portal
          </Link>
        </div>
      </div>
    </div>
  );
}
